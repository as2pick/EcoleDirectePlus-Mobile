import {
    useFocusEffect,
    useTheme as useNavigationTheme,
} from "@react-navigation/native";
import moment from "moment";
import { useCallback, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Modal,
    Pressable,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CONFIG } from "../../../constants/config";
import { useSingIn } from "../../../context/SignInContext";
import { useTheme as useAppTheme } from "../../../context/ThemeContext";
import { useUser } from "../../../context/UserContext";
import apiService from "../../../helpers/apiService";
import { storageServiceStates } from "../../../helpers/storageService";

const CARD = "rgb(47, 49, 88)";
const PANEL = "rgb(134, 133, 237)";
const TEXT = "rgb(247, 247, 255)";
const MUTED = "rgb(176, 179, 207)";
const BLUE = "rgb(105, 145, 255)";
const PURPLE = "rgb(126, 93, 224)";
const RED = "rgb(255, 112, 124)";
const GREEN = "rgb(95, 238, 170)";

export default function HomeScreen() {
    const { colors } = useNavigationTheme();
    const { toggleTheme } = useAppTheme();
    const { signOut } = useSingIn();
    const {
        globalUserData,
        userAccesToken,
        sortedGradesData,
        setSortedGradesData,
        sortedHomeworksData,
        setSortedHomeworksData,
        sortedTimetableData,
        setSortedTimetableData,
    } = useUser();

    const [storedUser, setStoredUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeList, setActiveList] = useState("homeworks");
    const [settingsVisible, setSettingsVisible] = useState(false);
    const scrollY = useRef(new Animated.Value(0)).current;

    const palette = useMemo(() => createDashboardPalette(colors), [colors]);

    const loadDashboardData = useCallback(
        async ({ forceApi = false } = {}) => {
            if (!forceApi) {
                setLoading(true);
            }

            const keys = ["userData", "grades", "homeworks", "timetable"];
            const [userData, grades, homeworks, timetable] = await Promise.all(
                keys.map((originKey) => storageServiceStates.getter({ originKey }))
            );

            const shouldFetchGrades = forceApi || !grades;
            const shouldFetchHomeworks = forceApi || !homeworks;
            const shouldFetchTimetable = forceApi || !timetable;

            if (userAccesToken) {
                await Promise.all([
                    shouldFetchGrades
                        ? apiService({ origin: "grades", userToken: userAccesToken })
                        : Promise.resolve(),
                    shouldFetchHomeworks
                        ? apiService({
                              origin: "homeworks",
                              userToken: userAccesToken,
                          })
                        : Promise.resolve(),
                    shouldFetchTimetable
                        ? apiService({
                              origin: "timetable",
                              userToken: userAccesToken,
                          })
                        : Promise.resolve(),
                ]);
            }

            const [freshGrades, freshHomeworks, freshTimetable] = await Promise.all(
                ["grades", "homeworks", "timetable"].map((originKey) =>
                    storageServiceStates.getter({ originKey })
                )
            );

            setStoredUser(userData);
            setSortedGradesData(freshGrades || grades);
            setSortedHomeworksData(freshHomeworks || homeworks);
            setSortedTimetableData(freshTimetable || timetable);
            setLoading(false);
        },
        [
            setSortedGradesData,
            setSortedHomeworksData,
            setSortedTimetableData,
            userAccesToken,
        ]
    );

    useFocusEffect(
        useCallback(() => {
            let mounted = true;

            loadDashboardData().catch((error) => {
                console.log("Dashboard loading error:", error);
                if (mounted) setLoading(false);
            });

            return () => {
                mounted = false;
            };
        }, [loadDashboardData])
    );

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await loadDashboardData({ forceApi: true });
        } catch (error) {
            console.log("Dashboard refresh error:", error);
        } finally {
            setRefreshing(false);
        }
    }, [loadDashboardData]);

    const firstName =
        globalUserData?.prenom ||
        globalUserData?.name ||
        storedUser?.name ||
        "vous";

    const gradeStats = useMemo(
        () => buildGradeStats(sortedGradesData),
        [sortedGradesData]
    );
    const courseStats = useMemo(
        () => buildCourseStats(sortedTimetableData),
        [sortedTimetableData]
    );
    const homeworkStats = useMemo(
        () => buildHomeworkStats(sortedHomeworksData),
        [sortedHomeworksData]
    );

    const listItems =
        activeList === "homeworks" ? homeworkStats.homeworks : homeworkStats.tests;

    const greetingAnimatedStyle = {
        transform: [
            {
                translateY: scrollY.interpolate({
                    inputRange: [-140, 0],
                    outputRange: [88, 0],
                    extrapolate: "clamp",
                }),
            },
            {
                scale: scrollY.interpolate({
                    inputRange: [-140, 0],
                    outputRange: [1.18, 1],
                    extrapolate: "clamp",
                }),
            },
        ],
    };
    const mascotAnimatedStyle = {
        transform: [
            {
                translateY: scrollY.interpolate({
                    inputRange: [-140, 0, 180],
                    outputRange: [-140, 0, 180],
                    extrapolate: "extend",
                }),
            },
        ],
    };

    return (
        <SafeAreaView style={styles.safeArea} mode="margin" edges={["top", "left", "right"]}>
            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor={palette.accent}
                        colors={[palette.accent]}
                    />
                }
                scrollEventThrottle={16}
            >
                <View style={[styles.hero, { backgroundColor: palette.panel }]}>
                    <Mascot animatedStyle={mascotAnimatedStyle} mascotSource={colors.mascot} />
                    <Animated.View style={[styles.greeting, greetingAnimatedStyle]}>
                        <Text style={[styles.hello, { color: palette.muted }]}>
                            Bonjour,
                        </Text>
                        <Text style={[styles.name, { color: palette.text }]}>
                            {firstName}
                        </Text>
                    </Animated.View>
                    <Pressable
                        onPress={() => setSettingsVisible(true)}
                        style={[
                            styles.settingsButton,
                            { backgroundColor: palette.soft, borderColor: palette.border },
                        ]}
                    >
                        <Text style={[styles.settingsButtonText, { color: palette.text }]}>
                            ...
                        </Text>
                    </Pressable>
                    <CourseCard courseStats={courseStats} palette={palette} />
                </View>

                <View style={[styles.averageCard, { backgroundColor: palette.card }]}>
                    <Text style={[styles.sectionLabel, { color: palette.accent }]}>
                        MOYENNE GENERALE
                    </Text>
                    <View style={styles.averageLine}>
                        <Text style={[styles.bigAverage, { color: palette.text }]}>
                            {formatGrade(gradeStats.generalAverage)}
                        </Text>
                        <Text style={[styles.outOf, { color: palette.muted }]}>/20</Text>
                    </View>
                    <Text style={[styles.periodText, { color: palette.muted }]}>
                        {gradeStats.periodLabel || "Periode en cours"}
                    </Text>
                </View>

                <View style={styles.subjectGrid}>
                    {gradeStats.subjects.map((subject, index) => (
                        <SubjectCard
                            key={`${subject.code}-${index}`}
                            subject={subject}
                            palette={palette}
                        />
                    ))}
                </View>

                <View
                    style={[
                        styles.segmented,
                        {
                            backgroundColor: palette.soft,
                            
                        },
                    ]}
                >
                    <Pressable
                        onPress={() => setActiveList("homeworks")}
                        style={[
                            styles.segment,
                            activeList === "homeworks" && {
                                backgroundColor: palette.card,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.segmentText,
                                {
                                    color:
                                        activeList === "homeworks"
                                            ? palette.text
                                            : palette.muted,
                                },
                            ]}
                        >
                            Devoirs
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setActiveList("tests")}
                        style={[
                            styles.segment,
                            activeList === "tests" && {
                                backgroundColor: palette.card,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.segmentText,
                                {
                                    color:
                                        activeList === "tests"
                                            ? palette.text
                                            : palette.muted,
                                },
                            ]}
                        >
                            Controles
                        </Text>
                    </Pressable>
                </View>

                {loading ? (
                    <View style={[styles.loadingCard, { backgroundColor: palette.card }]}>
                        <ActivityIndicator color={palette.accent} />
                    </View>
                ) : (
                    <View style={styles.workList}>
                        {listItems.length > 0 ? (
                            listItems.map((group) => (
                                <WorkCard
                                    key={`${group.date}-${activeList}`}
                                    group={group}
                                    kind={activeList}
                                    palette={palette}
                                />
                            ))
                        ) : (
                            <View
                                style={[styles.emptyCard, { backgroundColor: palette.card }]}
                            >
                                <Text style={[styles.emptyTitle, { color: palette.text }]}>
                                    {activeList === "homeworks"
                                        ? "Aucun devoir"
                                        : "Aucun controle"}
                                </Text>
                                <Text style={[styles.emptyText, { color: palette.muted }]}>
                                    Les donnees disponibles ne contiennent rien a afficher.
                                </Text>
                            </View>
                        )}
                    </View>
                )}
            </Animated.ScrollView>
            <SettingsModal
                visible={settingsVisible}
                onClose={() => setSettingsVisible(false)}
                onSignOut={signOut}
                onToggleTheme={toggleTheme}
                palette={palette}
            />
        </SafeAreaView>
    );
}

function CourseCard({ courseStats, palette }) {
    const primary = courseStats.current || courseStats.next;
    const secondary = courseStats.current ? courseStats.next : null;

    return (
        <View style={[styles.courseCard, { backgroundColor: palette.card }]}>
            <View style={styles.statusRow}>
                <View style={[styles.statusDot, { backgroundColor: palette.accent }]} />
                <Text style={[styles.statusText, { color: palette.accent }]}>
                    {courseStats.current ? "EN COURS" : "A VENIR"}
                </Text>
            </View>
            <View style={styles.courseHeader}>
                <Text numberOfLines={1} style={[styles.courseTitle, { color: palette.text }]}>
                    {primary?.libelle || "Aucun cours"}
                </Text>
                <Text style={[styles.courseTime, { color: palette.text }]}>
                    {primary ? `-> ${primary.endCourse?.time || ""}` : ""}
                </Text>
            </View>
            <View style={[styles.progressTrack, { backgroundColor: palette.border }]}>
                <View
                    style={[
                        styles.progressFill,
                        { width: `${courseStats.progress || 0}%` },
                        { backgroundColor: palette.accent },
                    ]}
                />
            </View>
            <View style={styles.midline}>
                <View style={[styles.line, { backgroundColor: palette.separator }]} />
                <Text
                    style={[
                        styles.timePill,
                        {
                            color: palette.text,
                            borderColor: palette.border,
                            backgroundColor: palette.soft,
                        },
                    ]}
                >
                    {courseStats.current
                        ? courseStats.remainingLabel
                        : courseStats.nextLabel}
                </Text>
                <View style={[styles.line, { backgroundColor: palette.separator }]} />
            </View>
            <View style={styles.nextCourseRow}>
                <View style={styles.nextCourseText}>
                    <Text
                        numberOfLines={1}
                        style={[styles.nextCourseTitle, { color: palette.text }]}
                    >
                        {secondary?.libelle || "Prochain cours"}
                    </Text>
                    <Text
                        numberOfLines={1}
                        style={[styles.nextCourseRoom, { color: palette.text }]}
                    >
                        {secondary
                            ? [secondary.teacher, secondary.room].filter(Boolean).join(" - ")
                            : "Planning a jour"}
                    </Text>
                </View>
                <View
                    style={[
                        styles.roomBadge,
                        {
                            borderColor: palette.accent,
                            backgroundColor: palette.soft,
                        },
                    ]}
                >
                    <Text style={[styles.roomBadgeText, { color: palette.accent }]}>
                        {secondary?.room || "--"}
                    </Text>
                </View>
            </View>
            <Text style={[styles.nextCourseTime, { color: palette.text }]}>
                {secondary
                    ? `${secondary.startCourse?.time || ""} / ${
                          secondary.endCourse?.time || ""
                      }`
                    : ""}
            </Text>
        </View>
    );
}

function SubjectCard({ subject, palette }) {
    return (
        <View style={[styles.subjectCard, { backgroundColor: palette.card }]}>
            <Text
                numberOfLines={1}
                style={[styles.subjectName, { color: subject.color }]}
            >
                {subject.shortName}
            </Text>
            <View style={styles.subjectAverageLine}>
                <Text style={[styles.subjectAverage, { color: palette.text }]}>
                    {formatGrade(subject.average)}
                </Text>
                <Text style={[styles.subjectOutOf, { color: palette.muted }]}>/20</Text>
            </View>
            <Text style={[styles.subjectCount, { color: palette.text }]}>
                ({formatCoef(subject.coef)})
            </Text>
        </View>
    );
}

function WorkCard({ group, kind, palette }) {
    const remaining = Math.max(
        0,
        moment(group.date, "YYYY-MM-DD")
            .startOf("day")
            .diff(moment().startOf("day"), "days")
    );

    return (
        <View style={[styles.workCard, { backgroundColor: palette.card }]}>
            <View style={styles.workHeader}>
                <Text style={[styles.workDate, { color: palette.text }]}>
                    {formatDay(group.date)}
                </Text>
                <View
                    style={[
                        styles.remainingBadge,
                        {
                            borderColor: palette.accent,
                            backgroundColor: palette.soft,
                        },
                    ]}
                >
                    <Text style={[styles.remainingText, { color: palette.accent }]}>
                        {group.items.length} restant{group.items.length > 1 ? "s" : ""}
                    </Text>
                </View>
            </View>
            <View style={styles.midline}>
                <View style={[styles.line, { backgroundColor: palette.separator }]} />
                <Text
                    style={[
                        styles.timePill,
                        {
                            color: palette.text,
                            borderColor: palette.border,
                            backgroundColor: palette.soft,
                        },
                    ]}
                >
                    Dans {remaining} jour{remaining > 1 ? "s" : ""}
                </Text>
                <View style={[styles.line, { backgroundColor: palette.separator }]} />
            </View>
            {group.items.slice(0, 3).map((item, index) => (
                <View key={`${item.subject}-${index}`} style={styles.workItem}>
                    <Text
                        numberOfLines={1}
                        style={[
                            styles.workSubject,
                            { color: kind === "tests" ? RED : PURPLE },
                        ]}
                    >
                        {item.subject}
                    </Text>
                    <Text
                        numberOfLines={1}
                        style={[styles.workDescription, { color: palette.muted }]}
                    >
                        {item.title}
                    </Text>
                </View>
            ))}
        </View>
    );
}

function getMascotSource(filename) {
    const mascotMap = {
        "canardmanchill2.png": require("../../../../assets/canardmanchill2.png"),
    };
    return mascotMap[filename] || mascotMap["canardmanchill2.png"];
}

function Mascot({ animatedStyle, mascotSource }) {
    return (
        <Animated.Image
            source={getMascotSource(mascotSource)}
            resizeMode="contain"
            style={[styles.mascot, animatedStyle]}
        />
    );
}

function SettingsModal({
    visible,
    onClose,
    onSignOut,
    onToggleTheme,
    palette,
}) {
    return (
        <Modal
            animationType="fade"
            transparent
            visible={visible}
            onRequestClose={onClose}
        >
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <Pressable
                    style={[
                        styles.settingsModal,
                        {
                            backgroundColor: palette.card,
                            borderColor: palette.border,
                        },
                    ]}
                >
                    <Text style={[styles.modalTitle, { color: palette.text }]}>
                        Parametres
                    </Text>
                    <Pressable
                        onPress={() => {
                            onToggleTheme();
                            onClose();
                        }}
                        style={[
                            styles.modalButton,
                            {
                                backgroundColor: palette.soft,
                                borderColor: palette.border,
                            },
                        ]}
                    >
                        <Text style={[styles.modalButtonText, { color: palette.text }]}>
                            Changer de theme
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            onClose();
                            onSignOut();
                        }}
                        style={[
                            styles.modalButton,
                            {
                                backgroundColor: palette.dangerSoft,
                                borderColor: palette.danger,
                            },
                        ]}
                    >
                        <Text style={[styles.modalButtonText, { color: palette.danger }]}>
                            Se deconnecter
                        </Text>
                    </Pressable>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

function buildCourseStats(timetableData = []) {
    const today = CONFIG.dateNow;
    const nowMs = moment().hours() * 3600000 + moment().minutes() * 60000;
    const todayCourses =
        timetableData?.find((day) => day.date === today)?.courses || [];

    const withTimes = todayCourses
        .filter((course) => course.startCourse?.time && course.endCourse?.time)
        .map((course) => ({
            ...course,
            startMs: timeToMs(course.startCourse.time),
            endMs: timeToMs(course.endCourse.time),
        }))
        .sort((a, b) => a.startMs - b.startMs);

    const current = withTimes.find(
        (course) => nowMs >= course.startMs && nowMs <= course.endMs
    );
    const next =
        withTimes.find((course) => course.startMs > nowMs) ||
        findFutureCourse(timetableData, today);

    if (!current) {
        return {
            current: null,
            next,
            progress: 0,
            nextLabel: next ? formatNextCourseLabel(next) : "",
        };
    }

    const progress =
        ((nowMs - current.startMs) / Math.max(current.endMs - current.startMs, 1)) *
        100;

    return {
        current,
        next,
        progress: Math.min(100, Math.max(0, progress)),
        remainingLabel: `Dans ${humanMinutes(current.endMs - nowMs)}`,
    };
}

function buildGradeStats(gradesData = {}) {
    const entries = Object.entries(gradesData || {})
        .filter(([periodCode]) => /^A00[1-3]$/.test(periodCode))
        .sort(([a], [b]) => a.localeCompare(b));
    const [periodCode, period] =
        [...entries]
            .reverse()
            .find(([, data]) => flattenDisciplines(data.groups).length > 0) || [];
    const subjects = flattenDisciplines(period?.groups)
        .map((subject) => ({
            code: subject.code || subject.libelle,
            shortName: shortSubject(subject.libelle || subject.code),
            average: calculateSubjectAverage(subject.grades || []),
            coef: parseNumber(subject.coef),
            count: subject.grades?.length || 0,
        }))
        .filter((subject) => subject.average != null && subject.coef > 0);

    const weighted = subjects.reduce(
        (acc, subject) => ({
            total: acc.total + subject.average * subject.coef,
            coef: acc.coef + subject.coef,
        }),
        { total: 0, coef: 0 }
    );

    return {
        periodLabel: formatPeriod(periodCode),
        generalAverage: weighted.coef ? weighted.total / weighted.coef : null,
        subjects: subjects
            .sort((a, b) => b.average - a.average)
            .slice(0, 3)
            .map((subject, index) => ({
                ...subject,
                color: [GREEN, PURPLE, RED][index] || BLUE,
            })),
    };
}

function buildHomeworkStats(homeworksData) {
    const items = normalizeHomeworkItems(homeworksData)
        .filter((item) =>
            item.date
                ? moment(item.date, "YYYY-MM-DD")
                      .startOf("day")
                      .isSameOrAfter(moment().startOf("day"))
                : false
        )
        .sort((a, b) =>
            moment(a.date, "YYYY-MM-DD").diff(moment(b.date, "YYYY-MM-DD"))
        );

    const homeworks = groupByDate(items.filter((item) => !item.isTest)).slice(0, 4);
    const tests = groupByDate(items.filter((item) => item.isTest)).slice(0, 4);

    return { homeworks, tests };
}

function normalizeHomeworkItems(data) {
    if (!data) return [];

    if (Array.isArray(data)) {
        return data.flatMap((item) => normalizeHomeworkEntry(item));
    }

    if (typeof data === "object") {
        return Object.entries(data).flatMap(([date, value]) => {
            const entries = Array.isArray(value) ? value : [value];
            return entries.flatMap((entry) => normalizeHomeworkEntry(entry, date));
        });
    }

    return [];
}

function normalizeHomeworkEntry(entry, fallbackDate = null) {
    if (!entry || typeof entry !== "object") return [];

    if (Array.isArray(entry.matieres)) {
        return entry.matieres.flatMap((value) =>
            normalizeHomeworkEntry(value, fallbackDate)
        );
    }

    if (entry.matieres && typeof entry.matieres === "object") {
        return Object.entries(entry.matieres).flatMap(([subject, value]) => {
            const entries = Array.isArray(value) ? value : [value];
            return entries.flatMap((item) =>
                normalizeHomeworkEntry(
                    {
                        ...item,
                        matiere: item?.matiere || item?.libelleMatiere || subject,
                    },
                    fallbackDate
                )
            );
        });
    }

    const date = firstDateValue(
        entry.date,
        entry.datePourLe,
        entry.datePour,
        entry.dateDevoir,
        entry.dateInterrogation,
        entry.dateFin,
        fallbackDate
    );
    const subject =
        entry.matiere ||
        entry.libelleMatiere ||
        entry.nomMatiere ||
        entry.libelleMatiereCourt ||
        entry.discipline ||
        entry.codeMatiere ||
        "MATIERE";
    const rawTitle =
        entry.aFaire?.contenu ||
        entry.aFaire?.libelle ||
        entry.aFaire?.description ||
        entry.interrogation?.contenu ||
        entry.interrogation?.libelle ||
        entry.interrogation?.description ||
        entry.contenu ||
        entry.libelle ||
        entry.titre ||
        entry.description ||
        "Travail a faire";

    return [
        {
            date,
            subject: String(subject).toUpperCase(),
            title: stripHtml(String(rawTitle)),
            isTest: Boolean(
                entry.interrogation ||
                    entry.isTest ||
                    entry.controle ||
                    entry.type === "interrogation"
            ),
        },
    ];
}

function groupByDate(items) {
    const groups = items.reduce((acc, item) => {
        if (!acc[item.date]) acc[item.date] = [];
        acc[item.date].push(item);
        return acc;
    }, {});

    return Object.entries(groups)
        .sort(([a], [b]) => moment(a, "YYYY-MM-DD").diff(moment(b, "YYYY-MM-DD")))
        .map(([date, groupedItems]) => ({
            date,
            items: groupedItems,
        }));
}

function firstDateValue(...values) {
    return values.find(
        (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)
    );
}

function flattenDisciplines(groups = []) {
    return groups.flatMap((group) =>
        group?.isDisciplineGroup ? group.disciplines || [] : group || []
    );
}

function findFutureCourse(timetableData = [], today) {
    return (timetableData || [])
        .filter((day) => day.date > today)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .flatMap((day) =>
            (day.courses || []).map((course) => ({
                ...course,
                startCourse: {
                    ...course.startCourse,
                    date: course.startCourse?.date || day.date,
                },
            }))
        )[0];
}

function calculateSubjectAverage(grades = []) {
    const totals = grades.reduce(
        (acc, grade) => {
            const value = parseNumber(grade.data?.grade);
            const outOf = parseNumber(grade.data?.outOf);
            const coef = parseNumber(grade.data?.coef);

            if (
                value == null ||
                outOf == null ||
                coef == null ||
                coef <= 0 ||
                grade.onlySkills ||
                (grade.notSignificant && value <= 10)
            ) {
                return acc;
            }

            const normalized = outOf !== 20 ? (value / outOf) * 20 : value;

            return {
                total: acc.total + normalized * coef,
                coef: acc.coef + coef,
            };
        },
        { total: 0, coef: 0 }
    );

    return totals.coef > 0 ? totals.total / totals.coef : null;
}

function parseNumber(value) {
    if (value == null || value === "") return null;
    if (typeof value === "number") return Number.isNaN(value) ? null : value;
    const parsed = Number(String(value).replace(",", "."));
    return Number.isNaN(parsed) ? null : parsed;
}

function timeToMs(time = "00:00") {
    const [hours = 0, minutes = 0] = time.split(":").map(Number);
    return hours * 3600000 + minutes * 60000;
}

function humanMinutes(ms) {
    const minutes = Math.max(0, Math.round(ms / 60000));
    if (minutes < 60) return `${minutes} mins`;
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    return `${hours}h${rest ? String(rest).padStart(2, "0") : ""}`;
}

function formatNextCourseLabel(course) {
    const courseDate = course.startCourse?.date;
    const courseTime = course.startCourse?.time;
    if (!courseDate) return "";

    if (/cong|vacance/i.test(course.libelle || "")) {
        return "Vacances";
    }

    const today = moment().startOf("day");
    const targetDay = moment(courseDate, "YYYY-MM-DD").startOf("day");
    const diffDays = targetDay.diff(today, "days");

    if (diffDays === 0) {
        const target = moment(`${courseDate} ${courseTime || "00:00"}`, "YYYY-MM-DD HH:mm");
        const minutes = target.diff(moment(), "minutes");
        return minutes > 0 && minutes < 90 ? `Dans ${humanMinutes(minutes * 60000)}` : courseTime;
    }

    if (diffDays === 1) return "Demain";

    return formatWeekday(courseDate);
}

function formatGrade(value) {
    if (value == null || Number.isNaN(Number(value))) return "--";
    return Number(value).toFixed(2);
}

function formatDay(date) {
    return new Intl.DateTimeFormat("fr-FR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
    })
        .format(parseLocalDate(date))
        .toUpperCase();
}

function formatPeriod(code) {
    const periodNumber = code?.match(/^A00([1-3])$/)?.[1];
    return periodNumber ? `Trimestre ${periodNumber}` : "";
}

function shortSubject(name = "") {
    return name
        .replace("MATHEMATIQUES", "MATHS")
        .replace("HISTOIRE-GEOGRAPHIE", "HISTOIRE")
        .split(" ")
        .slice(0, 2)
        .join(" ")
        .toUpperCase();
}

function stripHtml(value) {
    return value
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function formatWeekday(date) {
    const label = new Intl.DateTimeFormat("fr-FR", {
        weekday: "long",
    }).format(parseLocalDate(date));

    return label.charAt(0).toUpperCase() + label.slice(1);
}

function parseLocalDate(date) {
    const [year, month, day] = String(date).split("-").map(Number);
    return new Date(year, month - 1, day);
}

function formatCoef(coef) {
    return Number.isInteger(coef) ? String(coef) : String(coef).replace(".", ",");
}

function createDashboardPalette(colors) {
    return {
        panel: colors.bg?.bg2 || PANEL,
        card: colors.bg?.bg1 || CARD,
        soft: colors.bg?.bg4 || "rgba(11, 13, 36, 0.58)",
        text: colors.txt?.txt1 || TEXT,
        muted: colors.txt?.txt3 || MUTED,
        accent: colors.txt?.txt2 || BLUE,
        border: colors.border || "rgb(44, 48, 86)",
        separator: colors.bg?.bg3 || "rgba(235, 236, 255, 0.48)",
        danger: RED,
        dangerSoft: "rgba(255, 112, 124, 0.14)",
    };
}



const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 22,
        paddingTop: 24,
        paddingBottom: 34,
        gap: 16,
    },
    hero: {
        height: 350,
        borderRadius: 30,
        backgroundColor: PANEL,
        overflow: "hidden",
        paddingHorizontal: 26,
        paddingTop: 34,
        paddingBottom: 26,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8,
    },
    greeting: {
        alignSelf: "flex-start",
        zIndex: 2,
    },
    hello: {
        color: MUTED,
        fontSize: 16,
        letterSpacing: 0,
        fontWeight: "600",
    },
    name: {
        color: TEXT,
        fontSize: 28,
        fontWeight: "800",
    },
    mascot: {
        position: "absolute",
        right: -50,
        top: 4,
        width: 300,
        height: 300,
        zIndex: 0,
    },
    settingsButton: {
        position: "absolute",
        top: 20,
        right: 20,
        width: 38,
        height: 38,
        borderRadius: 19,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 4,
    },
    settingsButtonText: {
        fontSize: 20,
        fontWeight: "900",
        lineHeight: 18,
    },
    courseCard: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        minHeight: 171,
        borderRadius: 22,
        backgroundColor: CARD,
        padding: 20,
    },
    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 6,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: BLUE,
    },
    statusText: {
        color: BLUE,
        fontSize: 12,
        fontWeight: "800",
        letterSpacing: 1.5,
    },
    courseHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    },
    courseTitle: {
        flex: 1,
        color: TEXT,
        fontSize: 23,
        fontWeight: "900",
    },
    courseTime: {
        color: TEXT,
        fontSize: 15,
        fontWeight: "700",
    },
    progressTrack: {
        height: 6,
        marginTop: 8,
        borderRadius: 999,
        backgroundColor: "rgb(76, 88, 145)",
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        borderRadius: 999,
        backgroundColor: BLUE,
    },
    midline: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginVertical: 12,
    },
    line: {
        flex: 1,
        height: 2,
        borderRadius: 2,
        backgroundColor: "rgba(235, 236, 255, 0.48)",
    },
    timePill: {
        color: TEXT,
        fontSize: 11,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.22)",
        backgroundColor: "rgba(255,255,255,0.08)",
        overflow: "hidden",
    },
    nextCourseRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    nextCourseText: {
        flex: 1,
        paddingRight: 12,
    },
    nextCourseTitle: {
        color: TEXT,
        fontSize: 23,
        fontWeight: "900",
    },
    nextCourseRoom: {
        color: TEXT,
        opacity: 0.8,
        fontSize: 12,
        fontWeight: "700",
        marginTop: 4,
    },
    roomBadge: {
        borderRadius: 9,
        borderWidth: 1,
        borderColor: "rgb(66, 92, 164)",
        backgroundColor: "rgba(68, 103, 196, 0.32)",
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    roomBadgeText: {
        color: BLUE,
        fontSize: 14,
        fontWeight: "700",
    },
    nextCourseTime: {
        position: "absolute",
        right: 20,
        bottom: 18,
        color: TEXT,
        fontSize: 15,
        fontWeight: "800",
    },
    averageCard: {
        borderRadius: 16,
        backgroundColor: CARD,
        padding: 18,
        minHeight: 112,
    },
    sectionLabel: {
        color: BLUE,
        fontSize: 12,
        fontWeight: "800",
        letterSpacing: 1.4,
    },
    averageLine: {
        flexDirection: "row",
        alignItems: "flex-end",
        marginTop: 7,
    },
    bigAverage: {
        color: TEXT,
        fontSize: 30,
        lineHeight: 34,
        fontWeight: "900",
    },
    outOf: {
        color: MUTED,
        fontSize: 15,
        marginBottom: 5,
    },
    periodText: {
        color: MUTED,
        marginTop: 7,
        fontSize: 13,
        fontWeight: "600",
    },
    subjectGrid: {
        flexDirection: "row",
        gap: 10,
    },
    subjectCard: {
        flex: 1,
        minHeight: 84,
        borderRadius: 13,
        backgroundColor: CARD,
        padding: 14,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    subjectName: {
        fontSize: 10,
        fontWeight: "900",
        letterSpacing: 1,
    },
    subjectAverageLine: {
        flexDirection: "row",
        alignItems: "flex-end",
        marginTop: 11,
    },
    subjectAverage: {
        color: TEXT,
        fontSize: 20,
        fontWeight: "900",
    },
    subjectOutOf: {
        color: MUTED,
        fontSize: 12,
        marginBottom: 3,
    },
    subjectCount: {
        position: "absolute",
        top: 31,
        right: 12,
        color: TEXT,
        opacity: 0.8,
        fontSize: 11,
    },
    segmented: {
        alignSelf: "center",
        flexDirection: "row",
        borderWidth: 2,
        borderColor: "rgb(44, 48, 86)",
        borderRadius: 24,
        padding: 2,
        backgroundColor: "rgba(11, 13, 36, 0.58)",
    },
    segment: {
        minWidth: 110,
        height: 38,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    segmentActive: {
        backgroundColor: CARD,
    },
    segmentText: {
        color: "rgb(123, 126, 158)",
        fontSize: 13,
        fontWeight: "800",
    },
    segmentTextActive: {
        color: TEXT,
    },
    workList: {
        gap: 16,
    },
    workCard: {
        borderRadius: 16,
        backgroundColor: CARD,
        padding: 20,
    },
    workHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    },
    workDate: {
        flex: 1,
        color: TEXT,
        fontSize: 18,
        fontWeight: "900",
        letterSpacing: 1,
    },
    remainingBadge: {
        borderRadius: 9,
        borderWidth: 1,
        borderColor: "rgb(66, 92, 164)",
        backgroundColor: "rgba(68, 103, 196, 0.32)",
        paddingHorizontal: 11,
        paddingVertical: 5,
    },
    remainingText: {
        color: BLUE,
        fontWeight: "800",
        fontSize: 12,
    },
    workItem: {
        marginTop: 4,
    },
    workSubject: {
        fontSize: 17,
        fontWeight: "900",
        letterSpacing: 1,
    },
    workDescription: {
        color: MUTED,
        fontSize: 14,
        fontWeight: "700",
        marginLeft: 20,
        marginTop: 2,
    },
    loadingCard: {
        minHeight: 120,
        borderRadius: 16,
        backgroundColor: CARD,
        justifyContent: "center",
    },
    emptyCard: {
        borderRadius: 16,
        backgroundColor: CARD,
        padding: 20,
    },
    emptyTitle: {
        color: TEXT,
        fontSize: 18,
        fontWeight: "900",
    },
    emptyText: {
        color: MUTED,
        marginTop: 6,
        fontWeight: "600",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.46)",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },
    settingsModal: {
        width: "100%",
        borderRadius: 18,
        borderWidth: 1,
        padding: 20,
        gap: 12,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "900",
        marginBottom: 4,
    },
    modalButton: {
        minHeight: 48,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 14,
    },
    modalButtonText: {
        fontSize: 15,
        fontWeight: "800",
    },
});
