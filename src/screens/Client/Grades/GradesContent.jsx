import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useState } from "react";
import { Dimensions, Text, View } from "react-native";
import GradeArrow from "../../../../assets/svg/GradeArrow";
import BottomSheet from "../../../components/Layout/BottomSheet";

import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { DropDown, ScrollableStack } from "../../../components";
import { API } from "../../../constants/api/api";
import { useUser } from "../../../context/UserContext";
import { storageServiceStates } from "../../../helpers/storageService";
import { routesNames } from "../../../router/config/routesNames";
import { cssHslaToHsla } from "../../../utils/colorGenerator";
import { parseNumber } from "../../../utils/grades/makeAverage";
import Discipline from "./custom/classes/Discipline";
import Period from "./custom/classes/Period";
import AddGradeModal from "./custom/components/SimulateGradeModal";

import { useGrade } from "./custom/context/LocalContext";
import { calculateStrengthsWeaknesses, formatGradeText } from "./custom/helper";

const { width } = Dimensions.get("window");

export default function GradesContent() {
    const { sortedGradesData, setSortedGradesData, userAccesToken } = useUser();
    const { state, dispatch } = useGrade();

    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [periodes, setPeriodes] = useState([]);
    const [displayPeriode, setDisplayPeriode] = useState({});
    const [displayPeriodeName, setDisplayPeriodeName] = useState(); // DEFAULT A001
    const [strengths, setStrengths] = useState([]);
    const [weaknesses, setWeaknesses] = useState([]);
    const [bottomSheetOpened, setBottomSheetOpened] = useState(false);
    const [renderDisciplinesArray, setRenderDisciplineArray] = useState([]);
    const [generalAverage, setGeneralAverage] = useState(0);
    const [globalStreakScore, setGlobalStreakScore] = useState(0);
    const [expandedChain, setExpandedChain] = useState(null);
    const [isAddGradeModalVisible, setIsAddGradeModalVisible] = useState(false);
    const [simulatedDisciplineCodes, setSimulatedDisciplineCodes] = useState({});
    const [simulatedGradesDatas, setSimulatedGradeDatas] = useState([]);

    useEffect(() => {
        if (state.gradeData) {
            navigation.navigate(routesNames.client.grades.details, {
                gradeData: state.gradeData,
            });
            dispatch({ type: "RESET_GRADE_DETAILS" });
        }
    }, [state.gradeData]);

    useEffect(() => {
        if (state.simulation.disciplineCode) {
            setSimulatedDisciplineCodes({
                ...state.simulation.disciplineCode,
                period: displayPeriodeName,
            });
        }
    }, [state.simulation.disciplineCode]);

    useEffect(() => {
        if (state.gradeToRemove) {
            console.log(state.gradeToRemove, "to remove");
        }
    }, [state.gradeToRemove]);

    const fetchAndProcessGrades = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const userGrades = await storageServiceStates.getter({
                originKey: "grades",
            });
            setSortedGradesData(userGrades);
            setPeriodes(
                Object.entries(userGrades).map(([value, { periodName }]) => ({
                    label: periodName,
                    value,
                }))
            );
            setDisplayPeriode(userGrades["A001"]);
            setDisplayPeriodeName(API.DEFAULT_PERIOD_KEY); // A001
        } catch (err) {
            setError(err.message);
            console.error("Erreur lors du chargement des notes:", err);
        } finally {
            setLoading(false);
        }
    }, [setSortedGradesData]);

    useFocusEffect(
        useCallback(() => {
            if (sortedGradesData && Object.keys(sortedGradesData).length > 0) return;
            fetchAndProcessGrades();
        }, [userAccesToken, sortedGradesData, fetchAndProcessGrades])
    );

    useEffect(() => {
        if (!displayPeriode || Object.keys(displayPeriode).length === 0) return;

        try {
            setRenderDisciplineArray(flattenDisciplines(displayPeriode.groups));
            setGeneralAverage(
                new Period({
                    groups: displayPeriode.groups,
                }).makeGeneralAverage()
            );

            setGlobalStreakScore(displayPeriode.globalStreakScore);
        } catch (error) {
            console.error("Erreur lors du traitement des périodes:", error);
        }
    }, [displayPeriode]);

    useEffect(() => {
        if (Object.keys(displayPeriode).length === 0) return;

        try {
            const { strengths, weaknesses } = calculateStrengthsWeaknesses(
                displayPeriode,
                3
            );

            const formattedStrengths = strengths.map((item) => ({
                subject: item.subject.libelle || item.subject.code,
                average: parseNumber(item.subject.averageDatas?.userAverage),
            }));

            const formattedWeaknesses = weaknesses.map((item) => ({
                subject: item.subject.libelle || item.subject.code,
                average: parseNumber(item.subject.averageDatas?.userAverage),
            }));

            setStrengths(formattedStrengths);
            setWeaknesses(formattedWeaknesses);
        } catch (error) {
            console.error("Erreur lors du calcul des forces/faiblesses:", error);
            setStrengths([]);
            setWeaknesses([]);
        }
    }, [displayPeriode]);

    useEffect(() => {
        if (simulatedGradesDatas.length === 0) return;
    }, [simulatedGradesDatas]);

    const handleItemPress = useCallback((chain) => {
        setExpandedChain((prev) => (prev === chain ? null : chain));
    }, []);

    const renderItem = ({ item, index }) => {
        const DisciplineClass = new Discipline(item);
        DisciplineClass.simulatedGrades =
            simulatedGradesDatas.filter(
                (simGrade) =>
                    simGrade.codes.discipline === DisciplineClass.code &&
                    simGrade.codes.period === displayPeriodeName
            ) || [];

        if (DisciplineClass.isDisciplineGroup) {
            return DisciplineClass.RenderDisciplineGroup({
                dataLength: renderDisciplinesArray.length,
                index: index,
            });
        } else {
            return DisciplineClass.RenderDiscipline({
                dataLength: renderDisciplinesArray.length,
                index,
                isExpanded:
                    expandedChain ===
                    `${DisciplineClass.code}-${DisciplineClass.libelle}`,
                onPress: () =>
                    handleItemPress(
                        `${DisciplineClass.code}-${DisciplineClass.libelle}`
                    ),

                navigation: navigation,
                dispatch: dispatch,
            });
        }
    };

    const keyExtractor = useCallback(
        (item, index) => item.id?.toString() || `${item.libelle}-${index}`,
        []
    );

    return (
        <View style={{ flex: 1 }}>
            <View
                style={{
                    flex: 0.4,
                    pointerEvents: bottomSheetOpened ? "none" : "auto",
                }}
            >
                <SafeAreaView
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        alignItems: "center",
                        justifyContent: "flex-start",
                        marginTop: 3,
                        zIndex: 1,
                    }}
                >
                    {periodes.length > 0 && (
                        <DropDown
                            onSelect={(value) => {
                                setDisplayPeriode(sortedGradesData[value]);
                                setDisplayPeriodeName(value);
                            }}
                            options={periodes}
                        />
                    )}
                </SafeAreaView>
                <ScrollableStack
                    horizontal
                    paging
                    contentContainerStyle={{ alignItems: "center" }}
                    gap={0}
                >
                    <HeaderStatsCarousel
                        item={{
                            key: "streak",
                            text: "Ta streak",
                            value: globalStreakScore,
                            gradient: {
                                colors: ["rgb(255, 15, 0)", "rgba(255, 150, 0, .7)"],
                                locations: [0.24, 0.68],
                                start: { x: 0, y: 0 },
                                end: { x: 0, y: 1 },
                            },
                        }}
                    />
                    <HeaderStatsCarousel
                        item={{
                            key: "average",
                            text: "Moyenne Générale",
                            value: formatGradeText(generalAverage),
                            gradient: {
                                colors: ["rgb(68, 55, 149)", "rgb(119, 29, 124)"],
                                locations: [0.21, 0.66],
                                start: { x: 0, y: 0 },
                                end: { x: 0, y: 1 },
                            },
                        }}
                    />
                </ScrollableStack>
            </View>
            <View
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                }}
            >
                <BottomSheet
                    style={{
                        backgroundColor: "hsl(240, 35%, 11%)",
                        borderTopLeftRadius: 42,
                        borderTopRightRadius: 42,
                        zIndex: 1000,
                    }}
                    displayLine
                    opened={(state) => setBottomSheetOpened(state)}
                >
                    <View
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            marginHorizontal: 20,
                            backgroundColor: "hsl(240, 28%, 26%)",
                            borderRadius: 18,
                            padding: 16,
                            marginTop: 24,
                        }}
                    >
                        <ScrollableStack
                            horizontal
                            paging
                            contentContainerStyle={{
                                width: "200%",
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "column",
                                    flex: 1,
                                    gap: 8,
                                    width: "100%",
                                }}
                            >
                                <StrengthsAndWeakness
                                    firstColor={"hsla(115, 79%, 41%, 0.8)"}
                                    data={strengths}
                                />
                            </View>
                            <View
                                style={{
                                    flexDirection: "column",
                                    flex: 1,
                                    gap: 8,
                                    width: "100%",
                                }}
                            >
                                <StrengthsAndWeakness
                                    firstColor={"hsla(5, 79%, 41%, 0.8)"}
                                    data={weaknesses}
                                />
                            </View>
                        </ScrollableStack>
                    </View>
                    <View
                        style={{
                            marginHorizontal: 20,
                            flex: 1,
                            marginVertical: 20,
                        }}
                    >
                        <FlatList
                            data={renderDisciplinesArray}
                            renderItem={renderItem}
                            keyExtractor={keyExtractor}
                            contentContainerStyle={{ gap: 3 }}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </BottomSheet>
            </View>
            <AddGradeModal
                visible={state.simulation.modalOpen}
                onClose={() => dispatch({ type: "CLOSE_SIMULATION_MODAL" })}
                disciplineCodes={simulatedDisciplineCodes}
                setSimulatedGradeDatas={setSimulatedGradeDatas}
            />
        </View>
    );
}

const HeaderStatsCarousel = ({ item }) => (
    <View style={{ width, height: "100%", flex: 1 }}>
        <LinearGradient
            colors={item.gradient.colors}
            start={item.gradient.start}
            end={item.gradient.end}
            locations={item.gradient.locations}
            style={{ width, height: "100%", flex: 1 }}
        >
            <View
                style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
            >
                <Text
                    style={{ fontSize: 38, fontWeight: "900", textAlign: "center" }}
                >
                    {item.text}
                </Text>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    {Array.from({ length: 3 }).map((_, i) => (
                        <GradeArrow key={`left-${i}`} />
                    ))}
                    <Text style={{ fontSize: 64, fontWeight: "900" }}>
                        {item.value}
                    </Text>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <GradeArrow key={`right-${i}`} miroired />
                    ))}
                </View>
            </View>
        </LinearGradient>
    </View>
);

const StrengthsAndWeakness = ({ data, firstColor }) => {
    const [tint, saturation, lightness, opacity] = cssHslaToHsla(firstColor);
    const colors = [
        firstColor,
        `hsla(${tint + 3}, ${saturation - 4}%, ${lightness - 6}%, ${opacity})`,
        `hsla(${tint + 7}, ${saturation - 3}%, ${lightness - 14}%, ${opacity})`,
    ];

    return (
        <>
            {data.map(({ subject, average }, i) => (
                <View
                    style={{
                        backgroundColor: colors[i],
                        borderRadius: 50,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "100%",
                        padding: 8,
                        alignItems: "center",
                    }}
                    key={i}
                >
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center",
                            marginLeft: 6,
                            marginRight: 8,
                        }}
                    >
                        <Text>{i + 1} · </Text>
                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={{ flexShrink: 1 }}
                        >
                            {subject}
                        </Text>
                    </View>

                    <View
                        style={{
                            paddingHorizontal: 9,
                            paddingVertical: 4,
                            backgroundColor: "hsla(240, 26%, 13%, 0.35)",
                            borderRadius: 50,
                            justifyContent: "center",
                            alignItems: "center",
                            minWidth: "18%",
                        }}
                    >
                        <Text>{average}</Text>
                    </View>
                </View>
            ))}
        </>
    );
};

function flattenDisciplines(groups) {
    const result = [];

    groups.forEach((group) => {
        result.push(group);

        if (Array.isArray(group.disciplines)) {
            group.disciplines.forEach((discipline) => {
                result.push(discipline);
            });
        }
    });

    return result;
}

