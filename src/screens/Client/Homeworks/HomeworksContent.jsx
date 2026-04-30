import { memo, useCallback, useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
} from "react-native-reanimated";

import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import PlusIcon from "../../../../assets/svg/micro/PlusIcon";
import { HomeworkCard } from "../../../components";
import { Text } from "../../../components/Ui/core";
import { motivationSentences } from "../../../constants/features/homeworksConfig";

import { adjustLightness } from "../../../utils/colorGenerator";
import { formatFrenchDate } from "../../../utils/date";
import NewHomeworkModal from "./components/NewHomeworkModal";
import { useHomework } from "./context/LocalContext";
import { useHomeworksHandler } from "./hooks/useHomeworksHandler";

import { useCustomDataStore } from "../../../hooks/useCustomDataStore";
import useUserDatas from "../../../hooks/useUserDatas";
import { useHomeworks } from "../../../hooks/useHomeworks";
import { useUserStore } from "../../../hooks/useUserStore";

export default function HomeworksContent() {

    const token = useUserStore((state) => state.token);
    const { data: homeworksData, isLoading, isError, toggleHomework } = useHomeworks(token);
    const customHomeworksData = useCustomDataStore((state) => state.customHomeworks);
    const setUserState = useUserDatas((state) => state.setUserState);

    const { dispatch } = useHomework();

    const mergedHomeworks = useMemo(() => {
        if (!homeworksData) return null;
        const merged = JSON.parse(JSON.stringify(homeworksData));
        customHomeworksData.forEach((hw) => {
            if (!merged[hw.date]) {
                merged[hw.date] = [];
                if (!merged.formatedDates) merged.formatedDates = {};
                merged.formatedDates[hw.date] = { isEvaluation: hw.isEvaluation };
            }
            const alreadyExists = merged[hw.date].some((h) => h.id === hw.id);
            if (!alreadyExists) {
                merged[hw.date].push(hw);
            }
        });
        return merged;
    }, [homeworksData, customHomeworksData]);

    const [homeworksDates, setHomeworksDates] = useState();
    const [formatedDates, setFormatedDates] = useState();
    const [activeDate, setActiveDate] = useState("");
    const [progression, setProgression] = useState(0);
    const [displayTasks, setDisplayTasks] = useState([]);
    const [encouragementSentence, setEncouragemementSentence] = useState("");
    const [completedTasks, setCompletedTasks] = useState([]);

    const [modalOpen, setModalOpen] = useState(false);

    useHomeworksHandler({
        setModalOpen,
        toggleHomework,
    });

    const animatedWidth = useSharedValue(0);

    const pickSentence = useCallback(
        (progression) => {
            let key;

            if (progression === 0) {
                setEncouragemementSentence("");
                return;
            } else if (progression < 0.25) key = "0.25";
            else if (progression < 0.5) key = "0.5";
            else if (progression < 1) key = "0.75";
            else key = "1";

            const sentences = motivationSentences[key];
            setEncouragemementSentence(
                sentences[Math.floor(Math.random() * sentences.length)]
            );
        },
        [progression]
    );
    useFocusEffect(
        useCallback(() => {
            if (!mergedHomeworks) return;
            if (
                mergedHomeworks?.formatedDates &&
                Object.keys(mergedHomeworks).length > 0
            ) {
                setFormatedDates(mergedHomeworks.formatedDates);
                if (!activeDate || !mergedHomeworks?.formatedDates?.[activeDate]) {
                    setActiveDate(Object.keys(mergedHomeworks.formatedDates)[0]);
                }
                return;
            }

        }, [homeworksData, customHomeworksData, activeDate])
    );
    useEffect(() => {
        if (
            !homeworksData ||
            !customHomeworksData ||
            customHomeworksData.length === 0
        )
            return;

        const merged = JSON.parse(JSON.stringify(homeworksData));
        let hasChanged = false;

        customHomeworksData.forEach((custom) => {
            if (!merged[custom.date]) {
                merged[custom.date] = [];

                const frenchDate = formatFrenchDate(custom.date);
                const contractedDate = [
                    frenchDate.charAt(0).toLowerCase() + frenchDate.slice(1, 3),
                    frenchDate.split(" ")[1],
                ];

                merged.formatedDates[custom.date] = {
                    long: frenchDate,
                    contracted: contractedDate,
                    isEvaluation: false,
                };
                hasChanged = true;
            }

            const exists = merged[custom.date].some((hw) => hw.id === custom.id);
            if (!exists) {
                merged[custom.date].push(custom);
            }
        });
        Object.fromEntries(
            Object.entries(merged.formatedDates).sort(
                ([dateA], [dateB]) => new Date(dateB) - new Date(dateA)
            )
        );

        if (hasChanged) {
            merged.formatedDates = Object.fromEntries(
                Object.entries(merged.formatedDates).sort(
                    ([a], [b]) => new Date(a) - new Date(b)
                )
            );
        }
        setSortedHomeworksData(merged);
        const saveCustomHomeworks = async () => {
            setUserState({ customHomeworks: merged });
        };

        saveCustomHomeworks().catch((e) => {
            console.error("Error when try save custom homeworks", e);
        });
    }, [customHomeworksData]);

    useEffect(() => {
        if (!homeworksData || Object.keys(homeworksData).length === 0) return;

        setHomeworksDates(homeworksData.formatedDates);
    }, [homeworksData]);

    useEffect(() => {
        if (!activeDate || !mergedHomeworks) return;

        const datas = mergedHomeworks[activeDate] || [];
        setDisplayTasks(datas);
        const completed = datas.filter(({ isDone }) => isDone);
        setCompletedTasks(completed);
        const progression =
            datas.length > 0
                ? Math.round((completed.length / datas.length) * 100) / 100
                : 0;
        setProgression(progression);
        pickSentence(progression);
    }, [activeDate, mergedHomeworks]);

    useEffect(() => {
        if (!homeworksDates) return;
        setHomeworksDates((prev) => {
            prev[activeDate].allTasksCompleted = progression === 1;
            return { ...prev };
        });
    }, [progression, activeDate]);

    const renderDateItem = useCallback(
        ({ item }) => {
            const [date, { contracted, isEvaluation }] = item;

            const tasks = mergedHomeworks[date] ?? [];
            const allTasksCompleted =
                tasks.length > 0 && tasks.every(({ isDone }) => isDone);

            return (
                <DateItem
                    date={date}
                    contracted={contracted}
                    isEvaluation={isEvaluation}
                    isActive={date === activeDate}
                    allTasksCompleted={allTasksCompleted}
                    onPress={() => setActiveDate(date)}
                />
            );
        },
        [activeDate, homeworksData]
    );
    const renderHomework = useCallback(
        ({ item }) => <HomeworkCard dispatch={dispatch} homework={item} />,
        [dispatch]
    );

    if (isLoading) return <ActivityIndicator />;
    if (isError) return null;

    return (
        <>
            <NewHomeworkModal visible={modalOpen} />
            <View style={{ flex: 1 }}>
                <View
                    style={{
                        position: "absolute",
                        top: "5%",
                        right: "5%",
                        zIndex: 1000,
                        gap: 2,
                        zIndex: 1,
                    }}
                >
                    <TouchableOpacity
                        style={{
                            paddingHorizontal: 6,
                            backgroundColor: "hsl(240, 56%, 60%)",
                            borderRadius: 12,
                        }}
                        onPress={() => dispatch({ type: "OPEN_NEW_HOMEWORK_MODAL" })}
                    >
                        <PlusIcon size={36} />
                    </TouchableOpacity>
                </View>

                <SafeAreaView
                    style={{
                        height: "25%",
                        justifyContent: "space-between",
                        paddingTop: 14,
                    }}
                >
                    <View
                        style={{
                            backgroundColor: "hsl(240, 19%, 38%)",
                            alignSelf: "center",
                            paddingHorizontal: 12,
                            paddingVertical: 3,
                            borderRadius: 9,
                        }}
                    >
                        <Text align="center" preset="h3">
                            {completedTasks.length}/{displayTasks.length}
                        </Text>
                    </View>
                    <TasksProgression
                        progression={progression}
                        animatedWidth={animatedWidth}
                    />

                    <Text preset="custom1" align="center" color="hsl(240, 34%, 77%)">
                        {encouragementSentence}
                    </Text>
                </SafeAreaView>
                <View style={{ flex: 1 }}>
                    {homeworksDates && (
                        <View style={{ flexDirection: "row", paddingHorizontal: 9 }}>
                            <FlatList
                                data={Object.entries(homeworksDates)}
                                horizontal
                                renderItem={renderDateItem}
                                contentContainerStyle={{
                                    gap: 12,
                                    paddingVertical: 10,
                                    paddingHorizontal: 6,
                                }}
                                keyExtractor={([date]) => date}
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>
                    )}
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: "hsl(240, 29%, 11%)",
                            borderTopLeftRadius: 30,
                            borderTopRightRadius: 30,
                            padding: 24,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignSelf: "center",
                                marginBottom: 24,
                            }}
                        >
                            <Text preset="custom2">
                                {activeDate &&
                                    formatedDates &&
                                    formatedDates[activeDate].long}
                            </Text>
                        </View>

                        <FlatList
                            data={displayTasks}
                            renderItem={renderHomework}
                            keyExtractor={({ id }) => id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                gap: 10,
                            }}
                        />
                    </View>
                </View>
            </View>
        </>
    );
}

const TasksProgression = ({ progression, animatedWidth }) => {
    useEffect(() => {
        animatedWidth.value = withDelay(
            100,
            withSpring(progression * 100, {
                damping: 40,
                stiffness: 100,
            })
        );
    }, [progression]);

    const animatedStyle = useAnimatedStyle(() => {
        const hue = interpolate(animatedWidth.value, [0, 100], [0, 120]);

        return {
            width: `${animatedWidth.value}%`,
            backgroundColor: `hsl(${hue}, 100%, 50%)`,
        };
    });

    return (
        <View
            style={{
                marginHorizontal: 50,
                backgroundColor: "hsl(240, 15%, 33%)",
                borderRadius: 20,
            }}
        >
            <Animated.View
                style={[
                    {
                        height: 20,
                        borderRadius: 20,
                        alignItems: "flex-end",
                        justifyContent: "center",
                        paddingRight: 8,
                    },
                    animatedStyle,
                ]}
            />
        </View>
    );
};

const DateItem = memo(
    ({ contracted, isEvaluation, isActive, allTasksCompleted, onPress }) => {
        let dateBackgroundColor;
        if (isEvaluation && allTasksCompleted) {
            dateBackgroundColor = "hsl(28, 48%, 33%)"; //temp color
        } else if (isEvaluation) {
            dateBackgroundColor = "hsl(2, 63%, 43%)"; // temp color
        } else if (allTasksCompleted) {
            dateBackgroundColor = "hsl(115, 33%, 38%)"; // maybe good ?
        } else {
            dateBackgroundColor = "hsl(240, 19%, 36%)"; // keep this
        }
        return (
            <TouchableOpacity
                style={{
                    width: 58,
                    height: 58,
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 4,
                }}
                onPress={onPress}
                activeOpacity={0.7}
            >
                <View
                    style={{
                        width: 50,
                        height: 50,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: dateBackgroundColor,
                        borderRadius: 10,
                        ...(isActive && {
                            boxShadow: [
                                {
                                    offsetX: 0,
                                    offsetY: 0,
                                    blurRadius: 6,
                                    spreadDistance: 3,
                                    color: adjustLightness(dateBackgroundColor, 30),
                                },
                            ],
                        }),
                    }}
                >
                    <Text preset="label1">{contracted[1]}</Text>
                    <Text preset="label2">{contracted[0]}</Text>
                </View>
            </TouchableOpacity>
        );
    }
);
