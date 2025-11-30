import { useFocusEffect, useNavigation, useTheme } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Dimensions, View } from "react-native";
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";
import GradeArrow from "../../../../assets/svg/GradeArrow";

import { SafeAreaView } from "react-native-safe-area-context";
import { DropDown, ScrollableStack } from "../../../components";
import { API } from "../../../constants/api/api";
import { useUser } from "../../../context/UserContext";
import { storageServiceStates } from "../../../helpers/storageService";
import { cssHslaToHsla, addOpacityToCssRgb } from "../../../utils/colorGenerator";
import { parseNumber } from "../../../utils/grades/makeAverage";
import Discipline from "./custom/classes/Discipline";
import Period from "./custom/classes/Period";
import AddGradeModal from "./custom/components/SimulateGradeModal";

import { Text } from "../../../components/Ui/core";
import { useGrade } from "./custom/context/LocalContext";
import { calculateStrengthsWeaknesses, formatGradeText } from "./custom/helper";
import { useSimulation } from "./custom/hooks/useSimulation";

const { width, height } = Dimensions.get("window");

export default function GradesContent() {
    const { colors, shadow } = useTheme();
    const shadowColor = addOpacityToCssRgb("rgb(0, 0, 0)", shadow.oppacity);
    const { sortedGradesData, setSortedGradesData, userAccesToken } = useUser();
    const { state, dispatch } = useGrade();
    const navigation = useNavigation();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [periodes, setPeriodes] = useState([]);
    const [displayPeriode, setDisplayPeriode] = useState({});
    const [displayPeriodeName, setDisplayPeriodeName] = useState(
        API.DEFAULT_PERIOD_KEY
    ); // DEFAULT A001
    const [generalAverage, setGeneralAverage] = useState(0);
    const [globalStreakScore, setGlobalStreakScore] = useState(0);

    const [strengths, setStrengths] = useState([]);
    const [weaknesses, setWeaknesses] = useState([]);

    const [renderDisciplinesArray, setRenderDisciplineArray] = useState([]);
    const [expandedChain, setExpandedChain] = useState(null);

    const scrollY = useSharedValue(0);

    const scrollHandler = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y;
    });

    const containerStyle = useAnimatedStyle(() => {
        const progress = interpolate(scrollY.value, [0, 250], [0, 1], Extrapolation.CLAMP);
        const translateY = interpolate(scrollY.value, [0, 250], [0, 225], Extrapolation.CLAMP);

        return {
            marginHorizontal: interpolate(progress, [0, 1], [0, 14]),
            borderRadius: interpolate(progress, [0, 1], [0, 18]),
            marginTop: interpolate(progress, [0, 1], [0, 50]),
            marginBottom: interpolate(progress, [0, 1], [0, 24]),
            height: interpolate(progress, [0, 1], [height * 0.4, height * 0.3]),
            transform: [{ translateY }],
        };
    });

    const innerContainerStyle = useAnimatedStyle(() => {
        const progress = interpolate(scrollY.value, [0, 250], [0, 1], Extrapolation.CLAMP);
        return {
            borderRadius: interpolate(progress, [0, 1], [0, 18]),
            overflow: "hidden",
            flex: 1,
        };
    });

    const sheetStyle = useAnimatedStyle(() => {
        const translateY = interpolate(scrollY.value, [0, 250], [0, 225], Extrapolation.CLAMP);
        return {
            transform: [{ translateY }],
        };
    });

    const handleStyle = useAnimatedStyle(() => {
        const progress = interpolate(scrollY.value, [0, 250], [0, 1], Extrapolation.CLAMP);
        return {
            opacity: interpolate(progress, [0, 1], [1, 0]),
            height: interpolate(progress, [0, 1], [6, 0]),
            transform: [{ scale: interpolate(progress, [0, 1], [1, 0]) }],
        };
    });

    const handleContainerStyle = useAnimatedStyle(() => {
        const progress = interpolate(scrollY.value, [0, 250], [0, 1], Extrapolation.CLAMP);
        return {
            marginBottom: interpolate(progress, [0, 1], [24, 0]),
            height: interpolate(progress, [0, 1], [30, 0]), // 6 (height) + 24 (marginBottom) approx
        };
    });

    const itemWidthStyle = useAnimatedStyle(() => {
        const progress = interpolate(scrollY.value, [0, 250], [0, 1], Extrapolation.CLAMP);
        return {
            width: interpolate(
                progress,
                [0, 1],
                [width, width - 28]
            ),
        };
    });

    const [simulatedDisciplineCodes, setSimulatedDisciplineCodes] = useState({});

    useSimulation({
        dispatch,
        displayPeriodeName,
        setSimulatedDisciplineCodes,
        state,
        setRenderDisciplineArray,
        renderDisciplinesArray,
        displayPeriode,
        setGeneralAverage,
    });

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
            setDisplayPeriode(userGrades[API.DEFAULT_PERIOD_KEY]);
        } catch (err) {
            setError(err.message);
            console.error("Error while loading grades:", err);
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
            console.error("Error when try to load periods:", error);
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
            console.error("Error when calculate strength/weakness:", error);
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
                colors: colors,
            });
        } else {
            return DisciplineClass.RenderDiscipline({
                dataLength: renderDisciplinesArray.length,
                index,
                colors: colors,
                isExpanded:
                    expandedChain ===
                    `${DisciplineClass.code}-${DisciplineClass.libelle}`,
                onPress: () =>
                    handleItemPress(
                        `${DisciplineClass.code}-${DisciplineClass.libelle}`
                    ),

                dispatch: dispatch,
                shadowColor: shadowColor,
                shadow: shadow,
            });
        }
    };

    const keyExtractor = useCallback(
        (item, index) => item.id?.toString() || `${item.libelle}-${index}`,
        []
    );

    const streakItem = useMemo(() => ({
        key: "streak",
        text: "Ta streak",
        value: globalStreakScore,
        gradient: {
            colors: ["rgb(255, 15, 0)", "rgb(253, 170, 53)"],
            locations: [0.24, 0.68],
            start: { x: 0, y: 0 },
            end: { x: 0, y: 1 },
        },
    }), [globalStreakScore]);

    const averageItem = useMemo(() => ({
        key: "average",
        text: "Moyenne Générale",
        value: formatGradeText(generalAverage),
        gradient: {
            colors: ["rgb(68, 55, 149)", "rgb(119, 29, 124)"],
            locations: [0.21, 0.66],
            start: { x: 0, y: 0 },
            end: { x: 0, y: 1 },
        },
    }), [generalAverage]);

    return (
        <View style={{ flex: 1 }}>
            <Animated.ScrollView
                style={{ flex: 1 }}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                contentContainerStyle={{ paddingBottom: 110 }}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View
                    style={[
                        {
                            zIndex: 1000,
                            boxShadow: `1px 2px ${shadow.caseSize}px 0px ${shadowColor}`,
                        },
                        containerStyle,
                    ]}
                >
                    <Animated.View style={innerContainerStyle}>
                        <ScrollableStack
                            horizontal
                            paging
                            contentContainerStyle={{ alignItems: "center" }}
                            gap={0}

                        >
                            <HeaderStatsCarousel
                                style={itemWidthStyle}
                                item={streakItem}
                            />
                            <HeaderStatsCarousel
                                style={itemWidthStyle}
                                item={averageItem}
                            />
                        </ScrollableStack>
                    </Animated.View>
                </Animated.View>

                <Animated.View
                    style={[
                        {
                            backgroundColor: colors.background.gradient,
                            borderTopLeftRadius: 30,
                            borderTopRightRadius: 30,
                            minHeight: Dimensions.get("window").height * 0.6,
                            paddingTop: 24,
                            marginTop: -20,
                            zIndex: 2000,
                            marginBottom: 110,
                        },
                        sheetStyle,
                    ]}
                >
                    <Animated.View
                        style={[
                            {
                                alignItems: "center",
                                // marginBottom: 24, // Moved to animated style
                            },
                            handleContainerStyle,
                        ]}
                    >
                        <Animated.View
                            style={[
                                {
                                    width: 35,
                                    // height: 6, // Moved to animated style
                                    borderRadius: 10,
                                    backgroundColor: colors.contrast,
                                    marginTop: 5
                                },
                                handleStyle,
                            ]}
                        />
                    </Animated.View>

                    <View
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            marginHorizontal: 14,
                            backgroundColor: colors.secondary,
                            borderRadius: 18,
                            padding: 16,
                            marginBottom: 24,
                            marginTop: -5,
                            boxShadow: `1px 2px ${shadow.caseSize}px 0px ${shadowColor}`,
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

                    <View style={{ marginHorizontal: 14, gap: 4, paddingBottom: 110 }}>
                        {renderDisciplinesArray.map((item, index) => (
                            <View key={keyExtractor(item, index)}>
                                {renderItem({ item, index })}
                            </View>
                        ))}
                    </View>
                </Animated.View>
            </Animated.ScrollView>
            <AddGradeModal
                visible={state.simulation.modalOpen}
                disciplineCodes={simulatedDisciplineCodes}
            />
            <SafeAreaView
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    alignItems: "center",
                    justifyContent: "flex-start",
                    marginTop: 3,
                    zIndex: 3000,
                    pointerEvents: "box-none",
                }}
            >
                {periodes.length > 0 && (
                    <DropDown
                        onSelect={(value) => {
                            const changedPeriod = sortedGradesData[value];
                            setDisplayPeriode(changedPeriod);

                            setDisplayPeriodeName(value);
                        }}
                        options={periodes}
                    />
                )}
            </SafeAreaView>
        </View >
    );
}
// const { shadow } = useTheme();
// const shadowColor = addOpacityToCssRgb("rgb(0, 0, 0)", shadow.oppacity);
const HeaderStatsCarousel = memo(({ item, style }) => (
    <Animated.View style={[style, { height: "100%", flex: 1 }]}>
        <LinearGradient
            colors={item.gradient.colors}
            start={item.gradient.start}
            end={item.gradient.end}
            locations={item.gradient.locations}
            style={{ width: "100%", height: "100%", flex: 1 }}
        >
            <View
                style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
            >
                <Text size={38} weight="bold" align="center">
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
                    <Text size={64} weight="bold">
                        {item.value}
                    </Text>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <GradeArrow key={`right-${i}`} miroired />
                    ))}
                </View>
            </View>
        </LinearGradient>
    </Animated.View>
));

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
                        <Text preset="label1">{i + 1} · </Text>
                        <Text oneLine preset="label2" style={{ flexShrink: 1 }}>
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
                        <Text preset="label1">{formatGradeText(average)}</Text>
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

