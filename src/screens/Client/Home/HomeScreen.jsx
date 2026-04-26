import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import moment from "moment";
import "moment/locale/fr";
import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../context/ThemeContext";
import { useUser } from "../../../context/UserContext";
import { storageServiceStates } from "../../../helpers/storageService";
import { textToHSL } from "../../../utils/colorGenerator";
import handleBase64 from "../../../utils/handleBase64";

import SleepingCanardman from "../../../../assets/svg/SleepingCanardman.jsx";
import CanardmanChill from "../../../../assets/svg/CanardmanChill.jsx";

moment.locale("fr");

export default function HomeScreen() {
    const {
        globalUserData,
        sortedTimetableData,
        setSortedTimetableData,
        sortedGradesData,
        setSortedGradesData,
        sortedHomeworksData,
        setSortedHomeworksData,
    } = useUser();

    const { theme } = useTheme();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(moment());
    const [activeTab, setActiveTab] = useState("homeworks");

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(moment());
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const loadAllData = async () => {
            try {
                const [timetable, grades, homeworks] = await Promise.all([
                    storageServiceStates.getter({ originKey: "timetable" }),
                    storageServiceStates.getter({ originKey: "grades" }),
                    storageServiceStates.getter({ originKey: "homeworks" }),
                ]);

                if (timetable) setSortedTimetableData(timetable);
                if (grades) setSortedGradesData(grades);
                if (homeworks) setSortedHomeworksData(homeworks);
            } catch (error) {
                console.error("Error loading home data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadAllData();
    }, []);

    const timetableInfo = useMemo(() => {
        if (!sortedTimetableData) return { current: null, next: null, isHoliday: false };
        const todayStr = currentTime.format("YYYY-MM-DD");
        const todaySchedule = sortedTimetableData.find((day) => day.date === todayStr);
        
        if (!todaySchedule) return { current: null, next: null, isHoliday: true };

        const holidayCourse = todaySchedule.courses.find(c => c.libelle.includes("CONGÉS") || c.libelle.includes("VACANCES"));
        if (holidayCourse) return { current: null, next: null, isHoliday: true };

        const current = todaySchedule.courses.find((course) => {
            const start = moment(`${course.startCourse.date} ${course.startCourse.time}`, "YYYY-MM-DD HH:mm");
            const end = moment(`${course.endCourse.date} ${course.endCourse.time}`, "YYYY-MM-DD HH:mm");
            return currentTime.isBetween(start, end);
        });

        const next = todaySchedule.courses.find((course) => {
            const start = moment(`${course.startCourse.date} ${course.startCourse.time}`, "YYYY-MM-DD HH:mm");
            return start.isAfter(currentTime);
        });

        return { current, next, isHoliday: false };
    }, [sortedTimetableData, currentTime]);

    const progress = useMemo(() => {
        if (!timetableInfo.current) return 0;
        const start = moment(`${timetableInfo.current.startCourse.date} ${timetableInfo.current.startCourse.time}`, "YYYY-MM-DD HH:mm");
        const end = moment(`${timetableInfo.current.endCourse.date} ${timetableInfo.current.endCourse.time}`, "YYYY-MM-DD HH:mm");
        const totalDuration = end.diff(start);
        const elapsed = currentTime.diff(start);
        return Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
    }, [timetableInfo.current, currentTime]);

    const timeToNext = useMemo(() => {
        if (!timetableInfo.next) return null;
        const start = moment(`${timetableInfo.next.startCourse.date} ${timetableInfo.next.startCourse.time}`, "YYYY-MM-DD HH:mm");
        return start.diff(currentTime, "minutes");
    }, [timetableInfo.next, currentTime]);

    const getSubjectColor = (subjectName) => {
        const [h, s, l] = textToHSL({ text: subjectName });
        return `hsl(${h}, ${s}%, ${l}%)`;
    };

    const averages = useMemo(() => {
        if (!sortedGradesData) return { general: "0.00", subjects: [], period: 1 };
        const periodCodes = Object.keys(sortedGradesData);
        if (periodCodes.length === 0) return { general: "0.00", subjects: [], period: 1 };
        const latestPeriodCode = periodCodes[periodCodes.length - 1];
        const latestPeriod = sortedGradesData[latestPeriodCode];
        const subjects = latestPeriod.groups.flatMap(group => group.isDisciplineGroup ? group.disciplines : [group]);

        const subjectAverages = subjects.map(s => {
            const gradesList = s.grades || [];
            const validGrades = gradesList.filter(g => !g.notSignificant && g.data.grade !== null);
            if (validGrades.length === 0) return { name: s.libelle, average: null, count: 0 };
            let totalPoints = 0, totalCoef = 0;
            validGrades.forEach(g => {
                const coef = g.data.coef || 1;
                totalPoints += ((g.data.grade / g.data.outOf) * 20) * coef;
                totalCoef += coef;
            });
            return { name: s.libelle, average: (totalPoints / totalCoef).toFixed(2), count: validGrades.length, color: getSubjectColor(s.libelle) };
        }).filter(s => s.average !== null);

        const sortedSubjects = [...subjectAverages].sort((a, b) => b.average - a.average);
        const generalAverage = subjectAverages.length > 0 ? (subjectAverages.reduce((acc, s) => acc + parseFloat(s.average), 0) / subjectAverages.length).toFixed(2) : "0.00";
        return { general: generalAverage, subjects: sortedSubjects, period: latestPeriodCode.replace(/\D/g, '') || periodCodes.length };
    }, [sortedGradesData]);

    const homeworkInfo = useMemo(() => {
        if (!sortedHomeworksData) return [];
        const dates = Object.keys(sortedHomeworksData).sort();
        const futureDates = dates.filter(date => moment(date).isSameOrAfter(currentTime, 'day'));
        return futureDates.map(date => ({
            date,
            displayDate: moment(date).format("dddd D MMMM").toUpperCase(),
            daysAway: moment(date).diff(currentTime.clone().startOf('day'), 'days'),
            tasks: sortedHomeworksData[date].map(t => {
                let taskContent = "Pas de description";
                try {
                    const rawContent = t.aFaire?.contenu || t.devoir || "";
                    taskContent = rawContent ? handleBase64.decode(rawContent).replace(/<[^>]*>?/gm, '') : "Pas de description";
                } catch (e) { taskContent = "Description indisponible"; }
                return { subject: t.matiere || "Inconnu", task: taskContent, color: getSubjectColor(t.matiere || "Inconnu") };
            })
        }));
    }, [sortedHomeworksData, currentTime]);

    const examInfo = useMemo(() => {
        if (!sortedGradesData) return [];
        return Object.values(sortedGradesData).flatMap(p => p.groups.flatMap(g => (g.isDisciplineGroup ? g.disciplines : [g]).flatMap(d => d.grades || [])))
            .filter(g => g.isExam || g.homeworkType?.toLowerCase().includes("contrôle"))
            .sort((a, b) => moment(b.date).diff(moment(a.date))).slice(0, 5);
    }, [sortedGradesData]);

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: "rgb(12, 12, 32)" }]}>
                <ActivityIndicator size="large" color="#5C71FA" />
            </SafeAreaView>
        );
    }

    const firstName = globalUserData?.prenom || globalUserData?.name || "Étudiant";

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={["rgb(20, 25, 70)", "rgb(8, 8, 16)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
            />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={[styles.mascotBackground, { marginTop: 30 }]}>
                    <CanardmanChill 
                        size={320} 
                        style={{ 
                            transform: [{ rotate: '-15deg' }],
                            opacity: 0.1,
                            tintColor: 'white',
                        }} 
                    />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <View style={styles.headerTextContainer}>
                            <Text style={[styles.greeting, { color: "rgb(180, 180, 240)" }]}>Hey,</Text>
                            <View style={styles.nameRow}>
                                <Text style={[styles.name, { color: "white" }]}>{firstName}</Text>
                            </View>
                            <Text style={[styles.subGreeting, { color: "rgb(180, 180, 240)" }]}>Ravi de te revoir 👋</Text>
                        </View>
                    </View>

                    {timetableInfo.isHoliday ? (
                        <View style={[styles.card, styles.holidayCard]}>
                            <LinearGradient colors={["rgba(92, 113, 250, 0.2)", "rgba(92, 113, 250, 0.05)"]} style={styles.holidayGradient}>
                                <Text style={styles.holidayTitle}>🌴 C'EST LES VACANCES !</Text>
                                <Text style={styles.holidayText}>CanardMan en profite pour faire un petit somme... 💤💤💤</Text>
                                <View style={styles.holidayDuck}>
                                    <SleepingCanardman width={100} height={100} />
                                </View>
                            </LinearGradient>
                        </View>
                    ) : (
                        <View style={[styles.card, styles.courseCard]}>
                            <View style={styles.cardHeader}><Text style={[styles.cardTitle, { color: "#5C71FA" }]}>● EN COURS</Text></View>
                            {timetableInfo.current ? (
                                <>
                                    <View style={styles.courseRow}>
                                        <Text style={[styles.subjectName, { color: "white" }]} numberOfLines={1}>{timetableInfo.current.libelle}</Text>
                                        <Text style={[styles.timeText, { color: "white" }]}>→ {timetableInfo.current.endCourse.time}</Text>
                                    </View>
                                    <View style={styles.progressBarBg}>
                                        <LinearGradient colors={["#5C71FA", "#3F51B5"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.progressBar, { width: `${progress}%` }]} />
                                    </View>
                                </>
                            ) : <Text style={{ color: "grey", marginVertical: 10 }}>Aucun cours en cours</Text>}
                            {timetableInfo.next && (
                                <>
                                    <View style={styles.nextCourseSeparator}>
                                        <View style={styles.separatorLine} /><View style={styles.timeBadge}><Text style={styles.timeBadgeText}>Dans {timeToNext} mins</Text></View><View style={styles.separatorLine} />
                                    </View>
                                    <View style={styles.courseRow}>
                                        <Text style={[styles.nextSubjectName, { color: "white" }]} numberOfLines={1}>{timetableInfo.next.libelle}</Text>
                                        <View style={styles.roomBadge}><Text style={styles.roomText}>{timetableInfo.next.room || "???"}</Text></View>
                                    </View>
                                    <View style={styles.courseFooter}>
                                        <Text style={[styles.footerText, { color: "rgb(180, 180, 240)" }]} numberOfLines={1}>{timetableInfo.next.teacher || "Professeur inconnu"}</Text>
                                        <Text style={[styles.footerText, { color: "white" }]}>{timetableInfo.next.startCourse.time} / {timetableInfo.next.endCourse.time}</Text>
                                    </View>
                                </>
                            )}
                        </View>
                    )}

                    <View style={[styles.card, styles.averageCard]}>
                        <Text style={[styles.cardTitle, { color: "#5C71FA", marginBottom: 5 }]}>MOYENNE GÉNÉRALE</Text>
                        <View style={styles.averageRow}><Text style={[styles.averageValue, { color: "white" }]}>{averages.general}</Text><Text style={styles.averageTotal}>/20</Text></View>
                        <Text style={[styles.periodText, { color: "rgb(180, 180, 240)" }]}>Période {averages.period} • {moment().year()}</Text>
                    </View>

                    <View style={{ marginBottom: 20 }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {averages.subjects.slice(0, 3).map((subject, index) => (
                                <View key={index} style={[styles.smallCard, { borderColor: subject.color || "rgba(255,255,255,0.1)" }]}>
                                    <Text style={[styles.smallCardTitle, { color: subject.color || "white" }]} numberOfLines={1}>{subject.name.toUpperCase()}</Text>
                                    <View style={styles.smallCardValueRow}><Text style={[styles.smallCardValue, { color: "white" }]}>{subject.average}</Text><Text style={styles.smallCardTotal}>/20</Text><Text style={styles.superscript}>({subject.count})</Text></View>
                                </View>
                            ))}
                        </ScrollView>
                    </View>

                    <View style={styles.toggleContainer}>
                        <TouchableOpacity onPress={() => setActiveTab("homeworks")} style={activeTab === "homeworks" ? styles.toggleActive : styles.toggleInactive}><Text style={activeTab === "homeworks" ? styles.toggleTextActive : styles.toggleTextInactive}>Devoirs</Text><View style={styles.toggleIconBg}><Text style={{color: 'white', fontSize: 10}}>📖</Text></View></TouchableOpacity>
                        <TouchableOpacity onPress={() => setActiveTab("exams")} style={activeTab === "exams" ? styles.toggleActive : styles.toggleInactive}><Text style={activeTab === "exams" ? styles.toggleTextActive : styles.toggleTextInactive}>Contrôles</Text><Text style={{fontSize: 10}}>🪑</Text></TouchableOpacity>
                    </View>

                    {activeTab === "homeworks" ? homeworkInfo.slice(0, 2).map((day, idx) => (
                        <View key={idx} style={[styles.card, styles.homeworkCard]}>
                            <View style={styles.homeworkHeader}><Text style={[styles.homeworkDate, { color: "white" }]}>{day.displayDate}</Text><View style={styles.restantsBadge}><Text style={styles.restantsText}>{day.tasks.length} restants</Text></View></View>
                            <View style={styles.nextCourseSeparator}><View style={styles.separatorLine} /><View style={styles.timeBadge}><Text style={styles.timeBadgeText}>{day.daysAway === 0 ? "Aujourd'hui" : `Dans ${day.daysAway} jour${day.daysAway > 1 ? 's' : ''}`}</Text></View><View style={styles.separatorLine} /></View>
                            {day.tasks.map((task, tIdx) => (
                                <View key={tIdx} style={styles.homeworkItem}><Text style={[styles.homeworkSubject, { color: task.color || "#9C27B0" }]}>{task.subject.toUpperCase()}</Text><Text style={[styles.homeworkTask, { color: "rgb(180, 180, 240)" }]}>{task.task}</Text></View>
                            ))}
                        </View>
                    )) : (
                        <View style={[styles.card, styles.homeworkCard]}>
                            <Text style={[styles.homeworkDate, { color: "white", marginBottom: 15 }]}>Evaluations récentes</Text>
                            {examInfo.length > 0 ? examInfo.map((exam, idx) => (
                                <View key={idx} style={styles.homeworkItem}><View style={{flexDirection: 'row', justifyContent: 'space-between'}}><Text style={[styles.homeworkSubject, { color: getSubjectColor(exam.disciplineName) }]}>{exam.disciplineName.toUpperCase()}</Text><Text style={{color: 'white', fontWeight: 'bold'}}>{exam.data.grade}/{exam.data.outOf}</Text></View><Text style={[styles.homeworkTask, { color: "rgb(180, 180, 240)" }]}>{exam.libelle} • {moment(exam.date).format("D MMM")}</Text></View>
                            )) : <Text style={{color: 'grey'}}>Aucun contrôle récent</Text>}
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    mascotBackground: { position: "absolute", top: -50, right: -80, opacity: 1, backgroundColor: 'transparent', borderWidth: 0, shadowOpacity: 0 },
    scrollContent: { padding: 24 },
    header: { marginBottom: 30, flexDirection: 'row', alignItems: 'center' },
    headerTextContainer: { flex: 1 },
    nameRow: { flexDirection: 'row', alignItems: 'center' },
    greeting: { fontSize: 18, fontFamily: "Lexend-Regular" },
    name: { fontSize: 36, fontFamily: "Luciole-Regular", fontWeight: "bold" },
    subGreeting: { fontSize: 14, fontFamily: "Lexend-Regular", marginTop: 4, opacity: 0.8 },
    card: { borderRadius: 24, padding: 20, marginBottom: 20, backgroundColor: "rgb(25, 25, 56)", borderWidth: 1, borderColor: "rgba(255,255,255,0.05)", overflow: 'hidden' },
    holidayCard: { padding: 0, borderWidth: 0 },
    holidayGradient: { padding: 20, height: 150, justifyContent: 'center' },
    holidayTitle: { fontSize: 12, fontWeight: 'bold', color: '#5C71FA', letterSpacing: 1.5, marginBottom: 8 },
    holidayText: { color: 'white', fontSize: 16, fontFamily: 'Lexend-Regular', width: '70%' },
    holidayDuck: { position: 'absolute', right: 0, bottom: 20, opacity: 0.8 },
    courseCard: {},
    cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
    cardTitle: { fontSize: 12, fontFamily: "Lexend-Regular", letterSpacing: 1.5, fontWeight: "bold" },
    courseRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 4 },
    subjectName: { fontSize: 26, fontFamily: "Luciole-Regular", fontWeight: "bold", flex: 1 },
    nextSubjectName: { fontSize: 22, fontFamily: "Luciole-Regular", fontWeight: "bold", flex: 1 },
    timeText: { fontSize: 16, fontFamily: "Lexend-Regular", marginLeft: 10 },
    progressBarBg: { height: 6, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 3, marginTop: 10, marginBottom: 20 },
    progressBar: { height: "100%", borderRadius: 3 },
    nextCourseSeparator: { flexDirection: "row", alignItems: "center", marginVertical: 15 },
    separatorLine: { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.1)" },
    timeBadge: { backgroundColor: "rgba(255,255,255,0.1)", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginHorizontal: 10 },
    timeBadgeText: { fontSize: 10, color: "rgb(180, 180, 240)", fontWeight: "bold" },
    roomBadge: { backgroundColor: "rgba(92, 113, 250, 0.2)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginLeft: 10 },
    roomText: { fontSize: 12, color: "#5C71FA", fontWeight: "bold" },
    courseFooter: { flexDirection: "row", justifyContent: "space-between", marginTop: 5 },
    footerText: { fontSize: 12, fontFamily: "Lexend-Regular" },
    averageCard: { paddingVertical: 25 },
    averageRow: { flexDirection: "row", alignItems: "baseline" },
    averageValue: { fontSize: 48, fontFamily: "Luciole-Regular", fontWeight: "bold" },
    averageTotal: { fontSize: 24, color: "rgba(255,255,255,0.4)", marginLeft: 4 },
    periodText: { fontSize: 14, fontFamily: "Lexend-Regular", marginTop: 5 },
    smallCard: { width: 140, height: 100, borderRadius: 20, padding: 15, marginRight: 15, borderWidth: 1.5, backgroundColor: "rgb(25, 25, 56)", justifyContent: "space-between" },
    smallCardTitle: { fontSize: 10, fontWeight: "bold" },
    smallCardValueRow: { flexDirection: "row", alignItems: "baseline" },
    smallCardValue: { fontSize: 22, fontWeight: "bold" },
    smallCardTotal: { fontSize: 12, color: "rgba(255,255,255,0.4)", marginLeft: 2 },
    superscript: { fontSize: 10, color: "rgba(255,255,255,0.4)", marginLeft: 2, marginBottom: 8 },
    toggleContainer: { flexDirection: "row", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 25, padding: 4, alignSelf: "center", marginBottom: 25 },
    toggleActive: { flexDirection: "row", alignItems: "center", backgroundColor: "rgb(35, 35, 70)", paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
    toggleInactive: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 8 },
    toggleTextActive: { color: "white", fontWeight: "bold", marginRight: 8 },
    toggleTextInactive: { color: "rgba(255,255,255,0.3)", fontWeight: "bold", marginRight: 8 },
    toggleIconBg: { width: 20, height: 20, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.1)", justifyContent: "center", alignItems: "center" },
    homeworkCard: { paddingTop: 15 },
    homeworkHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    homeworkDate: { fontSize: 18, fontFamily: "Lexend-Regular", fontWeight: "bold" },
    restantsBadge: { backgroundColor: "rgba(92, 113, 250, 0.2)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
    restantsText: { color: "#5C71FA", fontSize: 12, fontWeight: "bold" },
    homeworkItem: { marginBottom: 20 },
    homeworkSubject: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
    homeworkTask: { fontSize: 14, fontFamily: "Lexend-Regular", lineHeight: 20 },
});