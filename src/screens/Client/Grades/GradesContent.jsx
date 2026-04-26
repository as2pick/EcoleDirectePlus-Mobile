import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import BottomSheet from "../../../components/Layout/BottomSheet";
import { useTheme } from "../../../context/ThemeContext";
import { useUser } from "../../../context/UserContext";
import { storageServiceStates } from "../../../helpers/storageService";
import { textToHSL } from "../../../utils/colorGenerator";

export default function GradesContent() {
    const { sortedGradesData, setSortedGradesData, userAccesToken } = useUser();
    const { theme } = useTheme();

    const [loading, setLoading] = useState(true);
    const [selectedSubject, setSelectedSubject] = useState(null);

    const getSubjectColor = (subjectName) => {
        const [h, s, l] = textToHSL({ text: subjectName });
        return `hsl(${h}, ${s}%, ${l}%)`;
    };

    useFocusEffect(
        useCallback(() => {
            if (!sortedGradesData || Object.keys(sortedGradesData).length === 0) {
                setLoading(true);
                storageServiceStates
                    .getter({ originKey: "grades" })
                    .then((userGrades) => {
                        setSortedGradesData(userGrades);
                        setLoading(false);
                    })
                    .catch((err) => {
                        console.error("Error loading grades:", err);
                        setLoading(false);
                    });
            } else {
                setLoading(false);
            }
        }, [userAccesToken, sortedGradesData])
    );

    const periodInfo = useMemo(() => {
        if (!sortedGradesData) return { subjects: [], general: "0.00", name: "" };
        const periodCodes = Object.keys(sortedGradesData);
        if (periodCodes.length === 0) return { subjects: [], general: "0.00", name: "" };
        
        const latestPeriodCode = periodCodes[periodCodes.length - 1];
        const periodData = sortedGradesData[latestPeriodCode];
        
        const subjects = periodData.groups.flatMap(group => 
            group.isDisciplineGroup ? group.disciplines : [group]
        ).map(s => {
            const grades = s.grades || [];
            const sum = grades.reduce((acc, g) => acc + (g.data.grade || 0), 0);
            const avg = grades.length > 0 ? (sum / grades.length).toFixed(2) : null;
            return {
                ...s,
                average: avg,
                color: getSubjectColor(s.libelle)
            };
        }).filter(s => s.average !== null);

        const general = subjects.length > 0 
            ? (subjects.reduce((acc, s) => acc + parseFloat(s.average), 0) / subjects.length).toFixed(2)
            : "0.00";

        return { subjects, general, name: latestPeriodCode };
    }, [sortedGradesData]);

    const displayGrades = useMemo(() => {
        if (!selectedSubject) {
            return periodInfo.subjects.flatMap(s => s.grades.map(g => ({ ...g, color: s.color })))
                .sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        const subject = periodInfo.subjects.find(s => s.libelle === selectedSubject);
        return subject ? subject.grades.map(g => ({ ...g, color: subject.color })) : [];
    }, [selectedSubject, periodInfo]);

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: "rgb(12, 12, 32)" }]}>
                <ActivityIndicator size="large" color="#5C71FA" />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: "rgb(12, 12, 32)" }]}>
            <View style={styles.header}>
                <Text style={styles.periodName}>Période {periodInfo.name}</Text>
                <View style={styles.generalAverageBox}>
                    <Text style={styles.generalAverageValue}>{periodInfo.general}</Text>
                    <Text style={styles.generalAverageLabel}>Moyenne Générale</Text>
                </View>
            </View>

            <View style={styles.subjectsContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.subjectsScroll}>
                    <TouchableOpacity 
                        onPress={() => setSelectedSubject(null)}
                        style={[styles.subjectTab, !selectedSubject && styles.activeTab]}
                    >
                        <Text style={[styles.tabText, !selectedSubject && styles.activeTabText]}>Tous</Text>
                    </TouchableOpacity>
                    {periodInfo.subjects.map((s, i) => (
                        <TouchableOpacity 
                            key={i} 
                            onPress={() => setSelectedSubject(s.libelle)}
                            style={[styles.subjectTab, selectedSubject === s.libelle && { borderColor: s.color, backgroundColor: "rgba(255,255,255,0.05)" }]}
                        >
                            <Text style={[styles.tabText, selectedSubject === s.libelle && { color: s.color }]}>{s.libelle}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <BottomSheet
                displayLine
                height="70%"
                debateSpacing="0%"
                movementDetectionHeight="15%"
                style={{ backgroundColor: "rgb(25, 25, 56)", borderTopLeftRadius: 30, borderTopRightRadius: 30 }}
            >
                <View style={styles.sheetContent}>
                    <Text style={styles.sheetTitle}>
                        {selectedSubject || "Toutes les notes"}
                    </Text>
                    <FlatList
                        data={displayGrades}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.gradeCard}>
                                <View style={[styles.gradeIndicator, { backgroundColor: item.color }]} />
                                <View style={styles.gradeInfo}>
                                    <Text style={styles.gradeLibelle} numberOfLines={1}>{item.libelle}</Text>
                                    <Text style={styles.gradeDate}>{moment(item.date).format("D MMMM YYYY")}</Text>
                                </View>
                                <View style={styles.gradeValueBox}>
                                    <Text style={styles.gradeValue}>{item.data.grade}</Text>
                                    <Text style={styles.gradeOutOf}>/{item.data.outOf}</Text>
                                </View>
                            </View>
                        )}
                        contentContainerStyle={styles.gradesList}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </BottomSheet>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 24,
        alignItems: "center",
    },
    periodName: {
        color: "rgb(180, 180, 240)",
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 10,
    },
    generalAverageBox: {
        alignItems: "center",
        marginBottom: 30,
    },
    generalAverageValue: {
        fontSize: 64,
        fontWeight: "bold",
        color: "white",
        fontFamily: "Luciole-Regular",
    },
    generalAverageLabel: {
        color: "rgb(180, 180, 240)",
        fontSize: 16,
    },
    subjectsContainer: {
        height: 50,
        marginBottom: 20,
    },
    subjectsScroll: {
        paddingHorizontal: 24,
        gap: 10,
    },
    subjectTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
        height: 40,
        justifyContent: "center",
    },
    activeTab: {
        backgroundColor: "#5C71FA",
        borderColor: "#5C71FA",
    },
    tabText: {
        color: "rgb(180, 180, 240)",
        fontWeight: "bold",
        fontSize: 12,
    },
    activeTabText: {
        color: "white",
    },
    sheetContent: {
        flex: 1,
        padding: 24,
    },
    sheetTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "white",
        marginBottom: 20,
        fontFamily: "Luciole-Regular",
    },
    gradesList: {
        paddingBottom: 40,
    },
    gradeCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.03)",
        borderRadius: 16,
        marginBottom: 12,
        overflow: "hidden",
        paddingRight: 16,
    },
    gradeIndicator: {
        width: 6,
        height: "100%",
        marginRight: 16,
    },
    gradeInfo: {
        flex: 1,
        paddingVertical: 12,
    },
    gradeLibelle: {
        color: "white",
        fontSize: 15,
        fontWeight: "bold",
        marginBottom: 4,
    },
    gradeDate: {
        color: "rgb(180, 180, 240)",
        fontSize: 12,
    },
    gradeValueBox: {
        flexDirection: "row",
        alignItems: "baseline",
    },
    gradeValue: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },
    gradeOutOf: {
        color: "rgba(255,255,255,0.4)",
        fontSize: 12,
    },
});
