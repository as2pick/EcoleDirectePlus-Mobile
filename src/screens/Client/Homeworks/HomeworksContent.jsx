import { memo, useCallback, useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
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
import LoadingWrapper from "../../../components/Layout/LoadingWrapper";
import { Text } from "../../../components/Ui/core";
import { motivationSentences } from "../../../constants/features/homeworksConfig";
import { useTheme } from "../../../context/ThemeContext";
import { useUser } from "../../../context/UserContext";
import { storageManager } from "../../../helpers/StorageManager";
import { adjustLightness } from "../../../utils/colorGenerator";
import Homeworks from "./custom/classes/Homeworks";
import { useHomework } from "./custom/context/LocalContext";
import { useHomeworksHandler } from "./custom/hooks/useHomeworksHandler";

export default function HomeworksContent() {
    const { sortedHomeworksData, setSortedHomeworksData, userAccesToken } =
        useUser();
    const { toggleTheme, colorScheme, isFollowingSystem, followSystemTheme } =
        useTheme();
    const { state, dispatch } = useHomework();

    const [loading, setLoading] = useState(true);
    const [homeworksDates, setHomeworksDates] = useState();
    const [formatedDates, setFormatedDates] = useState();
    const [activeDate, setActiveDate] = useState("");
    const [progression, setProgression] = useState(1);
    const [displayTasks, setDisplayTasks] = useState([]);
    const [encouragementSentence, setEncouragemementSentence] = useState("");
    const [completedTasks, setCompletedTasks] = useState([]);

    useHomeworksHandler({ state, dispatch });
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
            if (sortedHomeworksData && Object.keys(sortedHomeworksData).length > 0)
                return;

            const loadHomeworks = async () => {
                try {
                    const storedHomeworks = await storageManager.getter({
                        originKey: "homeworks",
                    });
                    if (storedHomeworks) {
                        setSortedHomeworksData(storedHomeworks);
                        setFormatedDates(storedHomeworks.formatedDates);
                        setActiveDate(Object.keys(storedHomeworks.formatedDates)[0]);
                    }
                } catch (error) {
                    console.error("Error while loading hw:", error);
                } finally {
                    setLoading(false);
                }
            };

            setLoading(true);
            loadHomeworks();
        }, [sortedHomeworksData])
    );

    useEffect(() => {
        if (!sortedHomeworksData || Object.keys(sortedHomeworksData).length === 0)
            return;

        setHomeworksDates(sortedHomeworksData.formatedDates);
    }, [sortedHomeworksData]);

    useEffect(() => {
        if (!activeDate) return;

        const datas = sortedHomeworksData[activeDate];
        setDisplayTasks(datas);
        const completed = datas.filter(({ isDone }) => isDone);
        setCompletedTasks(completed);
        const progression =
            Math.round((completed.length / datas.length) * 100) / 100;
        setProgression(progression);
        pickSentence(progression);
    }, [activeDate, sortedHomeworksData]);

    const renderDateItem = useCallback(
        ({ item }) => {
            const [date, { contracted, isEvaluation }] = item;

            return (
                <DateItem
                    date={date}
                    contracted={contracted}
                    isEvaluation={isEvaluation}
                    isActive={date === activeDate}
                    onPress={() => setActiveDate(date)}
                />
            );
        },
        [activeDate]
    );
    const renderHomework = useCallback(({ item }) => {
        const HomeworkClass = new Homeworks({
            ...item,
        });

        return HomeworkClass.RenderHomework({ dispatch });
    }, []);

    return (
        <LoadingWrapper loading={loading} setLoading={setLoading}>
            <View style={{ flex: 1 }}>
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
                            // alignItems: "center",
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
        </LoadingWrapper>
    );
}

// const Homework = memo(
//     ({
//         discipline,
//         givenOn,
//         isDone,
//         isEvaluation,
//         id,
//         homeworksContent,
//         onToggle,
//     }) => {
//         const gradientColors = isEvaluation
//             ? ["hsl(2, 63%, 43%)", "hsl(2, 54%, 23%)"]
//             : ["hsl(240, 19%, 38%)", "hsl(240, 20%, 23%)"];

//         return (
//             <LinearGradient
//                 colors={gradientColors}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 locations={[0.17, 1]}
//                 style={{
//                     height: 100,
//                     borderRadius: 20,
//                     overflow: "hidden",
//                     padding: 14,
//                     flexDirection: "row",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                 }}
//             >
//                 <View
//                     style={{
//                         justifyContent: "space-between",
//                         height: "100%",
//                     }}
//                 >
//                     <View
//                         style={{
//                             flexDirection: "row",
//                             gap: 8,
//                             alignItems: "center",
//                         }}
//                     >
//                         <Text preset="label1" oneLine>
//                             {discipline.name}
//                         </Text>
//                         <View
//                             style={{
//                                 backgroundColor: "hsl(240, 30%, 71%)",
//                                 width: 24,
//                                 height: 24,
//                                 justifyContent: "center",
//                                 alignItems: "center",
//                                 borderRadius: 12,
//                             }}
//                         >
//                             <Text preset="label3" align="center">
//                                 {homeworksContent.joinedDocuments.length || 0}
//                             </Text>
//                         </View>
//                     </View>

//                     <Text preset="label3" color="hsl(240, 19%, 68%)">
//                         Mis en ligne le {formatShortDate(givenOn)}
//                     </Text>
//                 </View>

//                 <TouchableOpacity // DEBUG
//                     style={{
//                         aspectRatio: 1,
//                         width: 40,
//                         backgroundColor: isDone ? "green" : "red",
//                         marginLeft: 12,
//                         borderRadius: "50%",
//                     }}
//                     onPress={onToggle}
//                 />
//             </LinearGradient>
//         );
//     }
// );

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

const DateItem = memo(({ contracted, isEvaluation, isActive, onPress }) => {
    const color = isEvaluation ? "hsl(2, 63%, 43%)" : "hsl(240, 19%, 36%)";
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
                    backgroundColor: color,
                    borderRadius: 10,
                    ...(isActive && {
                        boxShadow: [
                            {
                                offsetX: 0,
                                offsetY: 0,
                                blurRadius: 6,
                                spreadDistance: 3,
                                color: adjustLightness(color, 30),
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
});

