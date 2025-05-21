import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../../../context/UserContext";
import { storageServiceStates } from "../../../helpers/storageService";
import { routesNames } from "../../../router/config/routesNames";

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
    const [selectedValue, setSelectedValue] = useState(null);
    const [periodeItems, setPeriodeItems] = useState([]);

    useFocusEffect(
        useCallback(() => {
            if (!sortedGradesData || Object.keys(sortedGradesData).length === 0) {
                setLoading(true);
                storageServiceStates
                    .getter({ originKey: "grades" })
                    .then((userGrades) => {
                        setSortedGradesData(userGrades);
                        setPeriodes(userGrades.map((period) => period.name));

                        setLoading(false);
                    })
                    .catch((err) => {
                        setError(err.message);
                        setLoading(false);
                    });
            }
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

        setSelectedValue(items[0].value);
    }, [periodes]);

    useEffect(() => {
        if (!selectedValue) return;

        const selectedItem = periodeItems.find(
            (item) => item.value === selectedValue
        );
        if (!selectedItem) return;

        const found = sortedGradesData.find(
            ({ name }) => name === selectedItem.label
        );

        if (found) {
            setDisplayPeriode(found);
            // console.log(found); // we get grade objet for periode selected
        }
    }, [selectedValue, periodeItems]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <DropDownPicker
                open={open}
                value={selectedValue}
                items={periodeItems}
                setOpen={setOpen}
                setValue={setSelectedValue}
                setItems={setPeriodeItems}
                placeholder="Choisir une option"
                maxHeight={300}
            />

            {/* <ScrollView>
                {displayPeriode?.disciplines?.length ? (
                    displayPeriode.disciplines.map((discipline, i) => (
                        <View key={i}>
                            <Text>{discipline.discipline}</Text>
                            <Text>Moyenne: {discipline.average}</Text>
                            <Text>Coef: {discipline.coef}</Text>
                            <Text>Moyenne Classe: {discipline.classAverage}</Text>
                            <Text>Moyenne Max: {discipline.maxAverage}</Text>
                            <Text>Moyenne Min: {discipline.minAverage}</Text>
                            <Text>NOTES</Text>
                            {discipline.grades.map((grade, i) => (
                                <View key={i}>
                                    <Text>
                                        Nom: {grade.assignment} {i}
                                    </Text>
                                    <Text>
                                        Note eleve: {grade.gradeDetails.studentGrade}
                                    </Text>
                                    <Text>
                                        Note moyenne:{" "}
                                        {grade.gradeDetails.classAverage}
                                    </Text>
                                    <Text>
                                        Note max: {grade.gradeDetails.classMax}
                                    </Text>
                                    <Text>
                                        Note min: {grade.gradeDetails.classMin}
                                    </Text>
                                    <Text>Compétences</Text>
                                    {grade.academicSkills.map((skill, i) => (
                                        <View key={i}>
                                            <Text>Nom: {skill.skillName}</Text>
                                            <Text>
                                                Description: {skill.description}
                                            </Text>
                                            <Text>Comp: {skill.value}</Text>
                                        </View>
                                    ))}
                                </View>
                            ))}
                            <Text>FIN MATIERE</Text>
                        </View>
                    ))
                ) : (
                    <Text style={{ padding: 20 }}>Aucune donnée à afficher</Text>
                )}
            </ScrollView> */}
            <View>
                <Text>STREAK SCORE (lottie annim ?)</Text>
            </View>
            <View>
                <View>
                    {displayPeriode?.disciplines?.length ? (
                        displayPeriode.disciplines.map((discipline, i) => (
                            <View key={i} style={{ flexDirection: "row", gap: 20 }}>
                                <Text>{discipline.discipline}</Text>
                                <Text>{discipline.average}</Text>
                                <View style={{ flexDirection: "row" }}>
                                    {discipline.grades.map((grade, i) => (
                                        <Button
                                            key={i}
                                            onPress={() =>
                                                navigation.navigate(details, {
                                                    gradeData: grade,
                                                })
                                            }
                                            title={grade.gradeDetails.studentGrade}
                                        />
                                    ))}
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={{ padding: 20 }}>Aucune donnée à afficher</Text>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}

