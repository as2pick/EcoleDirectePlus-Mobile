import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";
import BottomSheet from "../../../components/Layout/BottomSheet";
import Onboarding from "../../../components/Layout/Onboarding";
import { useUser } from "../../../context/UserContext";
import { storageServiceStates } from "../../../helpers/storageService";
import { routesNames } from "../../../router/config/routesNames";
import {
    calculateStrengthsWeaknesses,
    deepEqualExcept,
} from "./grades/helpers/extras";
import {
    calculateStreak,
    createValidGradesArray,
    sortGradesByDate,
} from "./grades/streakManagment";

export default function GradesContent() {
    const { sortedGradesData, setSortedGradesData, userAccesToken } = useUser();
    const {
        client: {
            grades: { content, details, group },
        },
    } = routesNames;

    const navigation = useNavigation();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [periodes, setPeriodes] = useState([]);
    const [displayPeriode, setDisplayPeriode] = useState({});
    const [strengths, setStrengths] = useState([]);
    const [weaknesses, setWeaknesses] = useState([]);

    const injectStreakDataIntoGrades = useCallback((userGrades) => {
        Object.entries(userGrades).forEach(([periodKey, periodData]) => {
            const gradesArrayChronologicaly = sortGradesByDate(
                createValidGradesArray(userGrades, periodKey)
            );

            const streak = calculateStreak(
                gradesArrayChronologicaly,
                periodKey,
                userGrades
            );

            const periodDisciplines = periodData.groups.flatMap((group) =>
                group.isDisciplineGroup ? group.disciplines : [group]
            );

            streak.gradesItered.forEach((gradeData) => {
                const discipline = periodDisciplines.find(
                    ({ code }) => code === gradeData.codes.discipline
                );
                if (!discipline) return;

                const gradeToUpdate = discipline.grades.find((g) =>
                    deepEqualExcept(g, gradeData, ["actionOnStreak"])
                );

                if (gradeToUpdate) {
                    gradeToUpdate.actionOnStreak = gradeData.actionOnStreak;
                }
            });
        });
    }, []);

    const fetchAndProcessGrades = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const userGrades = await storageServiceStates.getter({
                originKey: "grades",
            });

            injectStreakDataIntoGrades(userGrades);

            setSortedGradesData(userGrades);
            setPeriodes(Object.keys(userGrades));
            setDisplayPeriode(userGrades["A001"]);
        } catch (err) {
            setError(err.message);
            console.error("Erreur lors du chargement des notes:", err);
        } finally {
            setLoading(false);
        }
    }, [setSortedGradesData, injectStreakDataIntoGrades]);

    useFocusEffect(
        useCallback(() => {
            if (sortedGradesData && Object.keys(sortedGradesData).length > 0) return;

            fetchAndProcessGrades();
        }, [userAccesToken, sortedGradesData, fetchAndProcessGrades])
    );

    useEffect(() => {
        if (!periodes.length) return;

        const valuePeriodFormatted = periodes.map((period) =>
            period
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]/g, "")
        );

        const items = periodes.map((label, index) => ({
            label,
            value: valuePeriodFormatted[index],
        }));
    }, [periodes]);

    useEffect(() => {
        if (Object.keys(displayPeriode).length === 0) return;

        try {
            const { strengths, weaknesses } = calculateStrengthsWeaknesses(
                displayPeriode,
                5
            );
            setStrengths(strengths);
            setWeaknesses(weaknesses);
        } catch (error) {
            console.error("Erreur lors du calcul des forces/faiblesses:", error);
            setStrengths([]);
            setWeaknesses([]);
        }
    }, [displayPeriode]);

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 0.4 }}>
                <Onboarding
                    data={[
                        {
                            displayText: "Ta streak",
                            value: "12",
                            gradient: {
                                colors: ["rgb(255, 15, 0)", "rgba(255, 150, 0, .7)"],
                                locations: [0.24, 0.68],
                                start: { x: 0, y: 0 },
                                end: { x: 0, y: 1 },
                            },
                        },
                        {
                            displayText: "Ta moy g",
                            value: "16",
                            gradient: {
                                colors: ["rgb(68, 55, 149)", "rgb(119, 29, 124)"],
                                locations: [0.21, 0.66],
                                start: { x: 0, y: 0 },
                                end: { x: 0, y: 1 },
                            },
                        },
                    ]}
                />
            </View>
            <View style={{ position: "absolute", width: "100%", height: "100%" }}>
                <BottomSheet
                    style={{ backgroundColor: "blue", borderRadius: 20 }}
                    displayLine
                >
                    <View>
                        <Text>Hello Worlde!</Text>
                    </View>
                </BottomSheet>
            </View>
        </View>
    );
}

