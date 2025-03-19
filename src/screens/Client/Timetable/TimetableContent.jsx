import { useCallback, useEffect, useRef, useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { OverLoader } from "../../../components";
import VerticalScrollView from "../../../components/Layout/VerticalScrollView";
import { CONFIG } from "../../../constants/config";
import { GLOBALS_DATAS } from "../../../constants/device/globals";
import { useUser } from "../../../context/UserContext";
import getTimetable from "../../../resolver/timetable";

let {
    screen: { height, width },
} = GLOBALS_DATAS;

height -= CONFIG.upper + 24; // ??? but works fine

export default function TimetableContent({ route }) {
    const { theme } = route.params;

    const { userAccesToken, sortedTimetableData, setSortedTimetableData } =
        useUser();

    const navigation = useNavigation();

    const scrollViewRef = useRef(null);

    const [activeDate, setActiveDate] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showLoader, setShowLoader] = useState(false);
    const [timetableDates, setTimetableDates] = useState(null);
    const [timetableViewDims, setTimetableViewDims] = useState({
        width: 0,
        height: 0,
    });

    useFocusEffect(
        useCallback(() => {
            if (
                !sortedTimetableData ||
                Object.keys(sortedTimetableData).length === 0
            ) {
                setLoading(true);
                getTimetable(userAccesToken).then((userTimetable) => {
                    console.log("loaded");
                    setSortedTimetableData(userTimetable);
                    setTimetableDates(userTimetable.map((data) => data.date));
                });
            }
        }, [userAccesToken, sortedTimetableData])
    );

    useEffect(() => {
        if (!sortedTimetableData || !timetableDates) return;
        setActiveDate(sortedTimetableData[currentIndex].iSODate);
    }, [currentIndex, sortedTimetableData, timetableDates]);

    useEffect(() => {
        if (!sortedTimetableData) return;
        setLoading(false);
    }, [sortedTimetableData]);

    if (loading) {
        return (
            <OverLoader
                bgOpacityValue={0.7}
                loaderStyles={styles.loader}
                annimationStartTiming={1000}
                triggerStateArr={[loading, setLoading]}
                triggerViewArr={[showLoader, setShowLoader]}
            />
        );
    }

    return (
        <SafeAreaView
            style={{
                position: "absolute",
                width: "100%",
                flex: 1,
            }}
        >
            <View
                style={{
                    margin: 24,

                    overflow: "hidden",
                    flex: 1,
                    height,

                    borderRadius: 23,

                    backgroundColor: theme.colors.bg.bg2,
                }}
            >
                <View
                    style={{
                        alignItems: "center",
                        width: "100%",
                        height: "8%",
                        zIndex: 100,
                    }}
                >
                    <TouchableOpacity
                        style={{
                            backgroundColor: theme.colors.bg.bg4,
                            width: "70%",
                            position: "absolute",
                            height: "65%",
                            borderRadius: 9999,
                            justifyContent: "center",
                            alignItems: "center",
                            overflow: "hidden",
                            bottom: 0,
                        }}
                    >
                        <Text
                            style={{
                                color: theme.colors.txt.txt1,
                                fontWeight: 600,
                                fontSize: 18,
                            }}
                        >
                            {activeDate}
                        </Text>
                    </TouchableOpacity>
                </View>
                {/* <TouchableOpacity
                    style={{
                        position: "absolute",
                        width: 50,
                        height: 50,
                        backgroundColor: "red",
                        zIndex: 1000,
                    }}
                    onPress={() => scrollViewRef.current?.scrollToIndex(0)}
                ></TouchableOpacity> */}
                <VerticalScrollView
                    arrayLength={sortedTimetableData?.length}
                    getIndex={(i) => setCurrentIndex(i)}
                    ref={scrollViewRef}
                >
                    {!loading &&
                        sortedTimetableData?.map((currentDay, index) => {
                            const { isJustNoon } = currentDay;
                            return (
                                <View
                                    key={index}
                                    style={{
                                        width: "100%",
                                        height: height - 100, // idk why but... works on other devices ?
                                        top: 20,

                                        alignItems: "center",
                                        position: "absolute",
                                        zIndex: 10,
                                    }}
                                    onLayout={(event) => {
                                        const { width, height } =
                                            event.nativeEvent.layout;
                                        setTimetableViewDims({ width, height });
                                    }}
                                >
                                    {currentDay?.courses.map((course, i) => {
                                        const {
                                            classGroup,
                                            endCourse,
                                            group,
                                            isCancelled,
                                            isDispensed,
                                            isEdited,
                                            libelle,
                                            room,
                                            startCourse,
                                            teacher,
                                            webId,
                                            color,
                                            placing,
                                            height,
                                            textColor,
                                        } = course;

                                        return (
                                            <TouchableOpacity
                                                key={webId}
                                                style={[
                                                    {
                                                        height: `${
                                                            height - 0.15 //0.15 --> little spacing
                                                        }%`,
                                                        top: `${placing}%`,
                                                        width: "90%",
                                                        borderColor: color,

                                                        borderWidth: 1.8,
                                                        borderRadius: 16,
                                                        position: "absolute",
                                                        paddingHorizontal: 12,
                                                        paddingVertical:
                                                            height <=
                                                            CONFIG.minCourseSize
                                                                ? timetableViewDims.height /
                                                                      CONFIG.minCourseSize /
                                                                      height +
                                                                  1 // to get a correct marging
                                                                : CONFIG.minCourseSize,
                                                        transform: [{ scale: 1 }],
                                                        overflow: "hidden",
                                                    },
                                                ]}
                                                onPress={() => {
                                                    navigation.navigate(
                                                        "timetable_course_detail",
                                                        { courseData: course }
                                                    );
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            position: "absolute",
                                                            backgroundColor: color,
                                                            borderRadius: 6,
                                                            paddingHorizontal: 8,
                                                            paddingVertical: 2,
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                fontSize: 16,
                                                                color: textColor,
                                                            }}
                                                        >
                                                            {libelle}
                                                        </Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            flexDirection:
                                                                height <= 17
                                                                    ? "row"
                                                                    : "column",
                                                            gap:
                                                                height <= 17
                                                                    ? 4.5
                                                                    : 2,
                                                            position: "absolute",
                                                            bottom: 0,
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                color: theme.colors
                                                                    .txt.txt1,
                                                                fontSize: 14,
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            {startCourse.time}
                                                        </Text>
                                                        <Text
                                                            style={{
                                                                color: theme.colors
                                                                    .txt.txt1,
                                                                fontSize: 14,
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            {endCourse.time}
                                                        </Text>
                                                    </View>
                                                    <Text
                                                        style={{
                                                            position: "absolute",
                                                            right: 0,
                                                            color: color,
                                                            fontWeight: 600,
                                                            fontSize: 14,
                                                        }}
                                                    >
                                                        {room}
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            position: "absolute",
                                                            bottom: 0,
                                                            right: 0,
                                                            fontSize: 13,
                                                            color: theme.colors.txt
                                                                .txt1,
                                                        }}
                                                    >
                                                        {teacher}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            );
                        })}
                </VerticalScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    loader: {
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgb(10, 10, 10)",
    },
});

