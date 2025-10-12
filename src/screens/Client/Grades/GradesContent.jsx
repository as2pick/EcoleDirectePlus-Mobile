import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useState } from "react";
import { Dimensions, Text, View } from "react-native";
import GradeArrow from "../../../../assets/svg/GradeArrow";
import BottomSheet from "../../../components/Layout/BottomSheet";

import { FlatList } from "react-native-gesture-handler";
import { ScrollableStack } from "../../../components";
import { useUser } from "../../../context/UserContext";
import { storageServiceStates } from "../../../helpers/storageService";
import { cssHslaToHsla } from "../../../utils/colorGenerator";
import { parseNumber } from "../../../utils/grades/makeAverage";
import Discipline from "./grades/classes/Discipline";
import Period from "./grades/classes/Period";
import AddGradeModal from "./grades/components/SimulateGradeModal";
import { calculateStrengthsWeaknesses, formatGradeText } from "./grades/helper";

const { width } = Dimensions.get("window");
// const GradeItem = memo(({ item, index, dataLength, isExpanded, onPress }) => {
//     if (item.isDisciplineGroup) {
//         return (
//             <View
//                 style={{
//                     backgroundColor: "hsl(240, 24%, 29%)",
//                     overflow: "hidden",

//                     ...(index === 0
//                         ? {
//                               borderTopLeftRadius: 12,
//                               borderTopRightRadius: 12,
//                               borderBottomLeftRadius: 3,
//                               borderBottomRightRadius: 3,
//                           }
//                         : { borderRadius: 3 }),
//                     ...(dataLength - 1 === index
//                         ? {
//                               borderTopLeftRadius: 3,
//                               borderTopRightRadius: 3,
//                               borderBottomLeftRadius: 12,
//                               borderBottomRightRadius: 12,
//                           }
//                         : { borderRadius: 3 }),
//                 }}
//                 key={index}
//             >
//                 <View
//                     style={{
//                         flexDirection: "row",
//                         justifyContent: "space-between",
//                         padding: 18,
//                         alignItems: "center",
//                     }}
//                 >
//                     <Text style={{ fontSize: 20 }}>{item.libelle}</Text>
//                     <View
//                         style={{
//                             backgroundColor: "hsla(240, 26%, 13%, .35)",
//                             borderRadius: 14,
//                             paddingHorizontal: 8,
//                             paddingVertical: 1,
//                             alignItems: "center",
//                             justifyContent: "center",
//                         }}
//                     >
//                         <Text style={{ fontSize: 24 }}>
//                             {item.averageDatas.userAverage}
//                         </Text>
//                     </View>
//                 </View>
//             </View>
//         );
//     }

//     return (
//         <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
//             <Animated.View
//                 style={{
//                     backgroundColor: "hsl(240, 27%, 16%)",
//                     overflow: "hidden",

//                     ...(index === 0
//                         ? {
//                               borderTopLeftRadius: 12,
//                               borderTopRightRadius: 12,
//                               borderBottomLeftRadius: 3,
//                               borderBottomRightRadius: 3,
//                           }
//                         : { borderRadius: 3 }),
//                     ...(dataLength - 1 === index
//                         ? {
//                               borderTopLeftRadius: 3,
//                               borderTopRightRadius: 3,
//                               borderBottomLeftRadius: 12,
//                               borderBottomRightRadius: 12,
//                           }
//                         : { borderRadius: 3 }),
//                 }}
//             >
//                 {/* HEADER */}
//                 <View
//                     style={{
//                         flexDirection: "row",
//                         justifyContent: "space-between",
//                         padding: 18,
//                         height: 80,
//                         alignItems: "center",
//                     }}
//                 >
//                     <View style={{ flexDirection: "row", gap: 18 }}>
//                         <View
//                             style={{
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 borderRadius: 500,
//                                 width: 42,
//                                 height: 42,
//                                 borderWidth: 2,
//                                 borderColor: "white",
//                                 backgroundColor: "hsl(240, 27%, 16%)",
//                             }}
//                         >
//                             <View
//                                 style={{
//                                     width: 34,
//                                     height: 34,
//                                     borderRadius: 500,
//                                     backgroundColor: "hsl(35, 100%, 50%)",
//                                     alignItems: "center",
//                                     justifyContent: "center",
//                                 }}
//                             >
//                                 <Text style={{ fontSize: 24, textAlign: "center" }}>
//                                     {item.streakCount}
//                                 </Text>
//                             </View>
//                         </View>
//                         <View>
//                             <Text style={{ fontSize: 14 }}>{item.libelle}</Text>
//                             <Text style={{ fontSize: 14 }}>{item.teatcher}</Text>
//                         </View>
//                     </View>
//                     <Text style={{ fontSize: 24 }}>
//                         {item.averageDatas.userAverage}
//                     </Text>
//                 </View>

//                 {/* CONTENU EXPANDABLE */}
//                 {isExpanded && (
//                     <Animated.View style={{ gap: 8, paddingBottom: 18 }}>
//                         {item.grades.map((grade, idx) => (
//                             <GradeRender key={idx} gradeData={grade} />
//                         ))}
//                     </Animated.View>
//                 )}
//             </Animated.View>
//         </TouchableOpacity>
//     );
// });
// const GradeRender = ({ gradeData }) => {
//     const grade = new Grade({ gradeData });
//     const uiBadges = {
//         max_grade: MaxGrade,
//         best_grade: BestGrade,
//         upper_than_class_average: UpperThanClassAverage,
//         upper_than_discipline_average: UpperThanDisciplineAverage,
//         up_the_streak: UpTheStreak,
//         equal_to_discipline_average: EqualToDisciplineAverage,
//     };
//     const navigation = useNavigation();
//     let backgroundColor = null;
//     switch (grade.actionOnStreak) {
//         case null:
//             backgroundColor = "hsl(240, 24%, 28%)";
//             break;
//         case true:
//             backgroundColor = "hsla(36, 100%, 34%, .3)";
//             break;
//         case false:
//             backgroundColor = "hsla(240, 10%, 41%, .3)";
//             break;
//     }

//     return (
//         <TouchableOpacity
//             onPress={() => navigation.navigate(routesNames.client.grades.details)}
//         >
//             <View
//                 style={{
//                     flexDirection: "row",
//                     marginHorizontal: 20,
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     backgroundColor,
//                     paddingHorizontal: 14,
//                     paddingVertical: 8,
//                     borderRadius: 13,
//                 }}
//             >
//                 <Text style={{}}>{grade.libelle}</Text>
//                 <View
//                     style={{ flexDirection: "row", gap: 10, marginHorizontal: 10 }}
//                 >
//                     {grade.badges.map((badge, i) => {
//                         const BadgeComponent = uiBadges[badge];
//                         return <BadgeComponent key={`${badge}-${i}`} size={24} />;
//                     })}
//                 </View>
//                 <Text>
//                     {grade.data.grade}
//                     {grade.data.outOf !== 20 && `/${grade.data.outOf}`}
//                 </Text>
//             </View>
//         </TouchableOpacity>
//     );
// };

export default function GradesContent() {
    const { sortedGradesData, setSortedGradesData, userAccesToken } = useUser();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [periodes, setPeriodes] = useState([]);
    const [displayPeriode, setDisplayPeriode] = useState({});
    const [strengths, setStrengths] = useState([]);
    const [weaknesses, setWeaknesses] = useState([]);
    const [bottomSheetOpened, setBottomSheetOpened] = useState(false);
    const [renderDisciplinesArray, setRenderDisciplineArray] = useState([]);
    const [generalAverage, setGeneralAverage] = useState(0);
    const [globalStreakScore, setGlobalStreakScore] = useState(0);
    const [expandedChain, setExpandedChain] = useState(null);
    const [isAddGradeModalVisible, setIsAddGradeModalVisible] = useState(false);
    const [simulatedDisciplineCodes, setSimulatedDisciplineCodes] = useState({});

    const openAddGradeModal = useCallback((disciplineCodes) => {
        setIsAddGradeModalVisible(true);
        setSimulatedDisciplineCodes(disciplineCodes);
    }, []);

    const closeAddGradeModal = useCallback(() => {
        setIsAddGradeModalVisible(false);
    }, []);
    const fetchAndProcessGrades = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const userGrades = await storageServiceStates.getter({
                originKey: "grades",
            });

            setSortedGradesData(userGrades);
            setPeriodes(Object.keys(userGrades));
            setDisplayPeriode(userGrades["A001"]);
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

    const handleItemPress = useCallback((chain) => {
        setExpandedChain((prev) => (prev === chain ? null : chain));
    }, []);

    const renderItem = ({ item, index }) => {
        const DisciplineClass = new Discipline(item);
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
                openAddGradeModal: openAddGradeModal,
            });
        }
    };

    const keyExtractor = useCallback(
        (item, index) => item.id?.toString() || `${item.libelle}-${index}`,
        []
    );
    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 0.4, elevation: 8 }}>
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
                    <View style={{ marginHorizontal: 20, flex: 1, marginTop: 20 }}>
                        <FlatList
                            data={renderDisciplinesArray}
                            renderItem={renderItem}
                            keyExtractor={keyExtractor}
                            contentContainerStyle={{ gap: 3 }}
                            showsVerticalScrollIndicator={false}
                            // removeClippedSubviews={true}
                            // maxToRenderPerBatch={10}
                            // updateCellsBatchingPeriod={50}
                            // initialNumToRender={15}
                            // windowSize={10}
                        />
                    </View>
                    {/* <Grade
                        badges={[
                            "best_grade",
                            "upper_than_class_average",
                            "up_the_streak", // obviously
                        ]}
                        grade={"20"}
                        name={"Eval 1"}
                        outOf={"10"}
                        upTheStreak={null}
                    /> */}
                </BottomSheet>
            </View>
            <AddGradeModal
                visible={isAddGradeModalVisible}
                onClose={closeAddGradeModal}
                disciplineCodes={simulatedDisciplineCodes}
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
                <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                            flexDirection: "row",
                            marginLeft: 6,
                            marginHorizontal: 12,
                        }}
                    >
                        <Text>{i + 1} ·</Text>
                        <Text>{subject}</Text>
                    </View>
                    <View
                        style={{
                            paddingHorizontal: 9,
                            paddingVertical: 4,
                            backgroundColor: "hsla(240, 26%, 13%, 0.35)",
                            borderRadius: 50,
                            justifyContent: "space-between",
                            minWidth: "18%",
                            alignItems: "center",
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

