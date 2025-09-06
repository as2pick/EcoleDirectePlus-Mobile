import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import InDev from "../../../components/Ui/InDev";
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
    const [testT, setTESTT] = useState("1");

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
        <SafeAreaView>
            <InDev />
        </SafeAreaView>
    );
}

