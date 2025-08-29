import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import InDev from "../../../components/UI/InDev";
import { useUser } from "../../../context/UserContext";
import { storageServiceStates } from "../../../helpers/storageService";
import { routesNames } from "../../../router/config/routesNames";
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
    // DropDownPicker
    const [open, setOpen] = useState(false);
    const [selectedPeriodDropDownId, setSelectedPeriodDropDownId] = useState(null);
    const [selectedPeriodName, setSelectedPeriodName] = useState(null);
    const [periodeItems, setPeriodeItems] = useState([]);

    const deepEqualExcept = (obj1, obj2, excludedKeys = []) => {
        if (obj1 === obj2) return true;

        if (obj1 == null || obj2 == null) return obj1 === obj2;
        if (typeof obj1 !== typeof obj2) return false;

        if (Array.isArray(obj1) && Array.isArray(obj2)) {
            if (obj1.length !== obj2.length) return false;
            return obj1.every((el, i) => deepEqualExcept(el, obj2[i], excludedKeys));
        }

        if (typeof obj1 === "object") {
            const keys1 = Object.keys(obj1).filter((k) => !excludedKeys.includes(k));
            const keys2 = Object.keys(obj2).filter((k) => !excludedKeys.includes(k));

            if (keys1.length !== keys2.length) return false;

            return keys1.every((k) =>
                deepEqualExcept(obj1[k], obj2[k], excludedKeys)
            );
        }

        return obj1 === obj2;
    };

    useFocusEffect(
        useCallback(() => {
            if (sortedGradesData && Object.keys(sortedGradesData).length > 0) return;

            const fetchGrades = async () => {
                try {
                    setLoading(true);

                    const userGrades = await storageServiceStates.getter({
                        originKey: "grades",
                    });

                    setSortedGradesData(userGrades);
                    setPeriodes(Object.keys(userGrades));

                    Object.entries(userGrades).forEach(([periodKey, periodData]) => {
                        const gradesArrayChronologicaly = sortGradesByDate(
                            createValidGradesArray(userGrades, periodKey)
                        );

                        const streak = calculateStreak(
                            gradesArrayChronologicaly,
                            periodKey,
                            userGrades
                        );

                        const periodDisciplines = periodData.groups.flatMap(
                            (group) =>
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
                                gradeToUpdate.actionOnStreak =
                                    gradeData.actionOnStreak;
                            }
                        });
                    });
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchGrades();
        }, [userAccesToken, sortedGradesData])
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

        setPeriodeItems(items);
        setSelectedPeriodDropDownId(items[0].value);
        setSelectedPeriodName(items[0].label);
        setDisplayPeriode(sortedGradesData[items[0].label]);
    }, [periodes]);

    useEffect(() => {
        if (!periodes) return;
    }, [periodes]);

    useEffect(() => {
        if (Object.keys(displayPeriode).length === 0) return;
    }, [displayPeriode]);

    return (
        <SafeAreaView>
            {/*<DropDownPicker
                open={open}
                value={selectedPeriodDropDownId}
                items={periodeItems}
                setOpen={setOpen}
                setValue={setSelectedPeriodDropDownId}
                onSelectItem={({ label }) => {
                    setDisplayPeriode(sortedGradesData[label]);
                    setSelectedPeriodName(label);
                }}
                setItems={setPeriodes}
                placeholder="Select"
            />
            {selectedPeriodDropDownId && (
                <Text>Choix: {selectedPeriodDropDownId.toUpperCase()}</Text>
            )}

            <Text>{selectedPeriodDropDownId}</Text>
            <Text>{selectedPeriodName}</Text>
            <ScrollView>
                <Text>{JSON.stringify(displayPeriode)}</Text>
            </ScrollView>*/}

            <InDev />
        </SafeAreaView>
    );
}

