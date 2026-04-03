import { useFocusEffect, useNavigation, useTheme } from "@react-navigation/native";

import { LinearGradient } from "expo-linear-gradient";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, View, TouchableOpacity } from "react-native";
import Animated, {
    Extrapolation,
    interpolate,
    interpolateColor,
    runOnJS,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    useAnimatedProps,
} from "react-native-reanimated";
import GradeArrow from "../../../../assets/svg/GradeArrow";
import LottieView from "lottie-react-native";
const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);
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
import InDev from "../../../components/Ui/InDev";

import { Text } from "../../../components/Ui/core";
import { useGrade } from "./custom/context/LocalContext";
import { calculateStrengthsWeaknesses, formatGradeText } from "./custom/helper";
import { useSimulation } from "./custom/hooks/useSimulation";

const { width, height } = Dimensions.get("window");

export default function GradesContent() {
    const { colors, shadow } = useTheme();
    const shadowColor = addOpacityToCssRgb("rgb(0, 0, 0)", shadow.oppacity);
    const [currentPage, setCurrentPage] = useState(0);
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
    const [expandedSW, setExpandedSW] = useState(null);

    const scrollY = useSharedValue(0);

    const HIDE_THRESHOLD = 90;
    const SHOW_THRESHOLD = 100;
    const SNAP_LOWER = 0;
    const SNAP_UPPER = 235;
    const SNAP_MIDPOINT = 80;

    const scrollRef = useRef(null);

    const snapIfNeeded = useCallback((y) => {
        if (y > 1 && y < SNAP_UPPER) {
            const target = y < SNAP_MIDPOINT ? SNAP_LOWER : SNAP_UPPER;
            scrollRef.current?.scrollTo({ y: target, animated: true });
        }
    }, []);

    const handleDragEnd = useCallback((e) => {
        const y = e.nativeEvent.contentOffset.y;
        const velocityY = e.nativeEvent.velocity?.y ?? 0;
        if (Math.abs(velocityY) < 0.3) {
            snapIfNeeded(y);
        }
    }, [snapIfNeeded]);

    const handleMomentumEnd = useCallback((e) => {
        snapIfNeeded(e.nativeEvent.contentOffset.y);
    }, [snapIfNeeded]);

    const scrollHandler = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y;
    });

    const scrollXStrengths = useSharedValue(0);
    const strengthsScrollHandler = useAnimatedScrollHandler((event) => {
        scrollXStrengths.value = event.contentOffset.x;
        runOnJS(setCarouselPage)(event.contentOffset.x > width / 2 ? 1 : 0);
    });
    const handleCarouselScroll = (event) => {
        scrollXStrengths.value = event.nativeEvent.contentOffset.x;
        setCarouselPage(event.nativeEvent.contentOffset.x > width / 2 ? 1 : 0);
    };

    const containerStyle = useAnimatedStyle(() => {
        const translateY = interpolate(scrollY.value, [0, 200], [0, -(height * 0.2)], Extrapolation.CLAMP);
        const opacity = interpolate(scrollY.value, [0, 120, 200], [1, 0.4, 0], Extrapolation.CLAMP);
        return {
            marginHorizontal: 0,
            marginTop: 0,
            marginBottom: 0,
            height: height * 0.39,
            paddingTop: 0,
            transform: [{ translateY }],
            opacity,
        };
    });

    const innerContainerStyle = {
        borderRadius: 0,
        overflow: "hidden",
        flex: 1,
    };



    const itemWidthStyle = {
        width: width,
    };

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
                classAverage: parseNumber(item.subject.averageDatas?.classAverage),
                diff: parseNumber(item.algebricDiff),
            }));

            const formattedWeaknesses = weaknesses.map((item) => ({
                subject: item.subject.libelle || item.subject.code,
                average: parseNumber(item.subject.averageDatas?.userAverage),
                classAverage: parseNumber(item.subject.averageDatas?.classAverage),
                diff: parseNumber(item.algebricDiff),
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

    const handleSWPress = useCallback((key) => {
        setExpandedSW((prev) => (prev === key ? null : key));
    }, []);



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
            locations: [0.34, 0.78],
            start: { x: 0, y: 0 },
            end: { x: 0, y: 1 },
        },
    }), [globalStreakScore]);

    const averageItem = useMemo(() => ({
        key: "average",
        text: "Moyenne G.",
        value: formatGradeText(generalAverage),
        gradient: {
            colors: ["rgb(68, 55, 149)", "rgb(119, 29, 124)"],
            locations: [0.21, 0.66],
            start: { x: 0, y: 0 },
            end: { x: 0, y: 1 },
        },
    }), [generalAverage]);

    const [showStreak, setShowStreak] = useState(true);
    const transition = useSharedValue(0);

    const streakStyle = useAnimatedStyle(() => ({
        opacity: interpolate(transition.value, [0.65, 0.75], [1, 0]),
    }));

    const averageStyle = useAnimatedStyle(() => ({
        opacity: interpolate(transition.value, [0.65, 0.75], [0, 1]),
    }));

    const toggleStats = () => {
        const next = !showStreak;
        setShowStreak(next);
        transition.value = withTiming(next ? 0 : 1, { duration: 600 });
    };

    const lottieProps = useAnimatedProps(() => {
        const pageWidth = width - 60;
        return {
            progress: interpolate(scrollXStrengths.value, [0, pageWidth], [0, 1], Extrapolation.CLAMP),
        };
    });

    const [carouselPage, setCarouselPage] = useState(0);
    const carouselRef = useRef(null);
    const [isStreghts, setIsStrenghts] = useState(true)

    return (
        <View style={{ flex: 1 }}>
            <Animated.ScrollView
                ref={scrollRef}
                style={{ flex: 1 }}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                onScrollEndDrag={handleDragEnd}
                onMomentumScrollEnd={handleMomentumEnd}
                contentContainerStyle={{ paddingBottom: 110 }}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View
                    style={[
                        {
                            zIndex: 3000,
                            boxShadow: `0px 2px 10px 5px ${shadowColor}`,
                            borderRadius: 30,
                            width: "100%",
                        },
                        containerStyle,
                    ]}
                >
                    <View style={innerContainerStyle}>
                        <TouchableOpacity onPress={toggleStats} activeOpacity={0.9} style={{ flex: 1, borderRadius: 30, overflow: "hidden" }}>
                            <HeaderStatsCarousel
                                style={[itemWidthStyle, streakStyle]}
                                item={streakItem}
                                transition={transition}
                            />
                            <HeaderStatsCarousel
                                style={[
                                    { position: "absolute", width: "100%", height: "100%" },
                                    averageStyle,
                                ]}
                                item={averageItem}
                                transition={transition}
                            />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
                <View
                    style={{
                        backgroundColor: colors.background.gradient,
                        borderTopLeftRadius: 45,
                        borderTopRightRadius: 45,
                        minHeight: Dimensions.get("window").height * 0.6,
                        paddingTop: 15,
                        zIndex: 2000,
                        marginBottom: -110
                    }}
                >

                    {currentPage === 0 && (
                        <View style={{ marginHorizontal: 14, paddingBottom: 110, gap: 12 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: -10 }}>
                                <Text preset="h3" style={{ fontWeight: "bold" }} >Notes</Text>
                                <TouchableOpacity style={{ borderRadius: 10, backgroundColor: "red", width: 30, height: 30 }} onPress={() => console.log("/20")} />
                            </View>
                            {groupForRendering(renderDisciplinesArray).map((group, gIndex) => {
                                const GroupClass = new Discipline(group.header);
                                return (
                                    <View key={keyExtractor(group.header, gIndex)}>
                                        {GroupClass.RenderDisciplineGroup({
                                            dataLength: group.disciplines.length,
                                            index: gIndex,
                                            colors,
                                        })}
                                        <View style={{ gap: 4 }}>
                                            {group.disciplines.map((item, dIndex) => {
                                                const DisciplineClass = new Discipline(item);
                                                return (
                                                    <View key={keyExtractor(item, dIndex)}>
                                                        {DisciplineClass.RenderDiscipline({
                                                            isFirst: dIndex === 0,
                                                            isLast: dIndex === group.disciplines.length - 1,
                                                            colors,
                                                            isExpanded: expandedChain === `${DisciplineClass.code}-${DisciplineClass.libelle}`,
                                                            onPress: () => handleItemPress(`${DisciplineClass.code}-${DisciplineClass.libelle}`),
                                                            dispatch,
                                                            shadowColor,
                                                            shadow,
                                                        })}
                                                    </View>
                                                );
                                            })}
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    )}

                    {currentPage === 1 && (
                        <View style={{ flex: 1, marginBottom: 180, marginHorizontal: 14 }}>
                            <Text preset="h3" style={{ fontWeight: "bold" }} >Statistiques</Text>
                            <View
                                style={{
                                    flexDirection: "column",
                                    flex: 1,
                                    gap: 10,
                                    marginBottom: 200,
                                }}
                            >
                                <View
                                    style={{
                                        marginTop: 8,
                                        borderRadius: 18,
                                        backgroundColor: colors.secondary,
                                        padding: 13,
                                    }}
                                >
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 7 }}>
                                        <Text preset="h4">{isStreghts ? "Forces" : "Faiblesses"}</Text>
                                        <TouchableOpacity style={{ backgroundColor: "red", borderRadius: 18, height: 30, width: 30, }} onPress={() => setIsStrenghts(prev => !prev)}>
                                        </TouchableOpacity>
                                    </View>
                                    {isStreghts ?
                                        <StrengthsAndWeakness
                                            firstColor={"hsla(115, 79%, 41%, 0.8)"}
                                            data={strengths}
                                            expandedKey={expandedSW}
                                            onItemPress={(key) => handleSWPress(key)}
                                            section="strengths"
                                        />
                                        :
                                        <StrengthsAndWeakness
                                            firstColor={"hsla(5, 79%, 41%, 0.8)"}
                                            data={weaknesses}
                                            expandedKey={expandedSW}
                                            onItemPress={(key) => handleSWPress(key)}
                                            section="weaknesses"
                                        />}
                                </View>
                                <InDev />
                            </View>
                        </View>
                    )}

                    {currentPage === 2 && (
                        <InDev />
                    )}
                </View>
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

const HeaderStatsCarousel = memo(({ item, style, transition }) => {
    const animatedGapStyle = useAnimatedStyle(() => {
        if (!transition) return { gap: 0 };

        return {
            gap: interpolate(transition.value, [0, 0.7, 1], [2, 8, 2], Extrapolation.CLAMP),
        };
    });

    const animatedEcartStyle = useAnimatedStyle(() => {
        if (!transition) return { marginHorizontal: 0 };

        return {
            marginHorizontal: interpolate(transition.value, [0, 0.65, 1], [2, 12, 2], Extrapolation.CLAMP),
        };
    });

    return (
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
                    <Text size={38} weight="bold" align="center" paddingTop={55}>
                        {item.text}
                    </Text>
                    <Animated.View
                        style={[
                            {
                                flexDirection: "row",
                                alignItems: "center",
                            },
                            animatedGapStyle,
                        ]}
                    >
                        {Array.from({ length: 3 }).map((_, i) => (
                            <GradeArrow key={`left-${i}`} />
                        ))}
                        <Animated.View style={animatedEcartStyle} />
                        <Text size={64} weight="bold">
                            {item.value}
                        </Text>
                        <Animated.View style={animatedEcartStyle} />
                        {Array.from({ length: 3 }).map((_, i) => (
                            <GradeArrow key={`right-${i}`} miroired />
                        ))}
                    </Animated.View>
                </View>
            </LinearGradient>
        </Animated.View >
    );
});

function StrengthsAndWeakness({ expandedKey, onItemPress, section, firstColor, data }) {
    const [tint, saturation, lightness, opacity] = cssHslaToHsla(firstColor);
    const colors = data.map((_, i) =>
        i === 0
            ? firstColor
            : `hsla(${tint + i * 3}, ${saturation - i * 2}%, ${lightness - i * 4}%, ${opacity})`
    );

    return (
        <View style={{ gap: 10 }}>
            {data.map(({ subject, average, classAverage, diff }, i) => {
                const key = `${section}-${i}`;
                return (
                    <StrengthItem
                        key={key}
                        index={i}
                        subject={subject}
                        average={average}
                        classAverage={classAverage}
                        diff={diff}
                        color={colors[i]}
                        isExpanded={expandedKey === key}
                        onPress={() => onItemPress(key)}
                    />
                );
            })}
        </View>
    );
}

function StrengthItem({ index, subject, average, classAverage, diff, color, isExpanded, onPress }) {
    const expandProgress = useSharedValue(isExpanded ? 1 : 0);

    useEffect(() => {
        expandProgress.value = withTiming(isExpanded ? 1 : 0, { duration: 300 });
    }, [isExpanded]);

    const animatedHeight = useAnimatedStyle(() => ({
        height: interpolate(expandProgress.value, [0, 1], [50, 150], Extrapolation.CLAMP),
    }));

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
            <Animated.View
                style={[{
                    backgroundColor: color,
                    borderRadius: 30,
                    flexDirection: "column",
                    width: "100%",
                    overflow: "hidden",
                    alignItems: "center"
                }, animatedHeight]}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 10,
                        top: 0,
                        height: 50,
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            marginLeft: 6,
                            marginRight: 8,
                        }}
                    >
                        <Text preset="label1">{index + 1} · </Text>
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
                            height: 30,
                        }}
                    >
                        <Text preset="label1">{diff >= 0 ? `+${formatGradeText(diff)}` : formatGradeText(diff)}</Text>
                    </View>
                </View>
                <View
                    style={{
                        height: 1,
                        borderRadius: 5,
                        backgroundColor: "rgba(63, 63, 63, 1)",
                        width: "90%",
                    }}
                />
                <View
                    style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: 12,

                    }}
                >
                    <Text>Ta moyenne</Text>
                    <Text>{formatGradeText(average)}</Text>
                </View>
                <View
                    style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: 12,

                    }}
                >
                    <Text>Moyenne de la classe</Text>
                    <Text>{formatGradeText(classAverage)}</Text>
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
}

const StrengthsAndWeakness2 = ({ data, firstColor }) => {
    const [tint, saturation, lightness, opacity] = cssHslaToHsla(firstColor);
    const colors = data.map((_, i) =>
        i === 0
            ? firstColor
            : `hsla(${tint + i * 3}, ${saturation - i * 2}%, ${lightness - i * 4}%, ${opacity})`
    );

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

function groupForRendering(flatArray) {
    const groups = [];
    let currentGroup = null;

    flatArray.forEach((item) => {
        if (item.isDisciplineGroup) {
            currentGroup = { header: item, disciplines: [] };
            groups.push(currentGroup);
        } else if (currentGroup) {
            currentGroup.disciplines.push(item);
        }
    });

    return groups;
}

