import { useFocusEffect } from "@react-navigation/native";
import moment from "moment";
import { useCallback, useMemo, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../context/ThemeContext";
import { useUser } from "../../../context/UserContext";
import { storageServiceStates } from "../../../helpers/storageService";
import { textToHSL } from "../../../utils/colorGenerator";

export default function HomeworksScreen() {
    const { sortedHomeworksData, setSortedHomeworksData, userAccesToken } =
        useUser();
    const [loading, setLoading] = useState(true);
    const { theme, toggleTheme, colorScheme } = useTheme();

    const getSubjectColor = (subjectName) => {
        const [h, s, l] = textToHSL({ text: subjectName });
        return `hsl(${h}, ${s}%, ${l}%)`;
    };

    useFocusEffect(
        useCallback(() => {
            if (
                !sortedHomeworksData ||
                Object.keys(sortedHomeworksData).length === 0
            ) {
                setLoading(true);
                storageServiceStates
                    .getter({ originKey: "homeworks" })
                    .then((userHomeworks) => {
                        setSortedHomeworksData(userHomeworks);
                        setLoading(false);
                    })
                    .catch((err) => {
                        console.error("Error loading homeworks:", err);
                        setLoading(false);
                    });
            } else {
                setLoading(false);
            }
        }, [userAccesToken, sortedHomeworksData])
    );

    const homeworkDays = useMemo(() => {
        if (!sortedHomeworksData) return [];
        const dates = Object.keys(sortedHomeworksData).sort();
        return dates.map((date) => ({
            date,
            displayDate: moment(date).format("dddd D MMMM").toUpperCase(),
            tasks: sortedHomeworksData[date].map((t) => ({
                ...t,
                color: getSubjectColor(t.matiere),
            })),
        }));
    }, [sortedHomeworksData]);

    if (loading) {
        return (
            <SafeAreaView
                style={[styles.container, { backgroundColor: "rgb(12, 12, 32)" }]}
            >
                <ActivityIndicator size="large" color="#5C71FA" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: "rgb(12, 12, 32)" }]}
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Devoirs</Text>
                <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
                    <Text style={{ color: "white" }}>
                        {colorScheme === "dark" ? "🌙" : "☀️"}
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {homeworkDays.length > 0 ? (
                    homeworkDays.map((day, index) => (
                        <View key={index} style={styles.dayContainer}>
                            <View style={styles.dayHeader}>
                                <Text style={styles.dayDate}>{day.displayDate}</Text>
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>
                                        {day.tasks.length} devoirs
                                    </Text>
                                </View>
                            </View>

                            {day.tasks.map((task, tIdx) => (
                                <View key={tIdx} style={styles.taskCard}>
                                    <View
                                        style={[
                                            styles.subjectIndicator,
                                            { backgroundColor: task.color },
                                        ]}
                                    />
                                    <View style={styles.taskContent}>
                                        <Text style={[styles.subjectName, { color: task.color }]}>
                                            {task.matiere.toUpperCase()}
                                        </Text>
                                        <Text style={styles.taskText}>{task.devoir}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Aucun devoir pour le moment.</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingVertical: 20,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: "bold",
        color: "white",
        fontFamily: "Luciole-Regular",
    },
    themeToggle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgb(25, 25, 56)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    dayContainer: {
        marginBottom: 30,
    },
    dayHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    dayDate: {
        fontSize: 16,
        color: "rgb(180, 180, 240)",
        fontWeight: "bold",
        fontFamily: "Lexend-Regular",
    },
    badge: {
        backgroundColor: "rgba(92, 113, 250, 0.2)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    badgeText: {
        color: "#5C71FA",
        fontSize: 12,
        fontWeight: "bold",
    },
    taskCard: {
        backgroundColor: "rgb(25, 25, 56)",
        borderRadius: 20,
        marginBottom: 12,
        flexDirection: "row",
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
    },
    subjectIndicator: {
        width: 6,
        height: "100%",
    },
    taskContent: {
        padding: 16,
        flex: 1,
    },
    subjectName: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 4,
        fontFamily: "Lexend-Regular",
    },
    taskText: {
        fontSize: 15,
        color: "rgb(200, 200, 240)",
        fontFamily: "Lexend-Regular",
        lineHeight: 22,
    },
    emptyContainer: {
        marginTop: 100,
        alignItems: "center",
    },
    emptyText: {
        color: "rgb(180, 180, 240)",
        fontSize: 16,
    },
});
