import { useCallback, useEffect, useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import VerticalScrollView from "../../../components/VerticalScrollView";
import { CONFIG } from "../../../constants/config";
import { GLOBALS_DATAS } from "../../../constants/device/globals";
import { useUser } from "../../../context/UserContext";
import getTimetable from "../../../resolver/timetable";
import { isDarkColor } from "../../../utils/colorGenerator";
import { formatFrenchDate } from "../../../utils/date";

let {
    screen: { height, width },
} = GLOBALS_DATAS;

height -= CONFIG.upper + 24; // ??? but works fine

export default function TimetableScreen({ theme }) {
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timetableDates, setTimetableDates] = useState(null);
    const [currentDay, setCurrentDay] = useState(null);
    const [timetableViewDims, setTimetableViewDims] = useState({
        width: 0,
        height: 0,
    });
    const [activeDate, setActiveDate] = useState("");

    const { userAccesToken, sortedTimetableData, setSortedTimetableData } =
        useUser();

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
        setCurrentDay(sortedTimetableData[timetableDates[currentIndex]]);
        setActiveDate(formatFrenchDate(sortedTimetableData[currentIndex].date));
    }, [currentIndex, sortedTimetableData, timetableDates]);

    useEffect(() => {
        if (!sortedTimetableData) return;
        setLoading(false);
    }, [sortedTimetableData]);

    if (loading) {
        return <Text>Loading...</Text>;
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

                <VerticalScrollView
                    arrayLength={sortedTimetableData?.length}
                    getIndex={(i) => setCurrentIndex(i)}
                >
                    {!loading &&
                        sortedTimetableData?.map((currentDay, index) => {
                            return (
                                <View
                                    key={index}
                                    style={{
                                        width: "100%",
                                        height: height - 100, // idk why but works on other devices ?
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
                                        } = course;
                                        // console.log(
                                        //     sortedTimetableData[index].courses[i]
                                        //         .height
                                        // );
                                        const currentCourse =
                                            sortedTimetableData[index].courses[i];
                                        const dynamicColor = isDarkColor(
                                            course.color
                                        )
                                            ? "hsl(0, 100%, 100%)"
                                            : "hsl(0, 0%, 0%)";

                                        return (
                                            <TouchableOpacity
                                                key={i}
                                                style={[
                                                    {
                                                        height: `${
                                                            currentCourse.height -
                                                            0.15 //0.15 --> little spacing
                                                        }%`,
                                                        top: `${currentCourse.placing}%`,
                                                        width: "90%",
                                                        borderColor:
                                                            currentCourse.color,

                                                        borderWidth: 1.8,
                                                        borderRadius: 16,
                                                        position: "absolute",
                                                        padding: 12,

                                                        overflow: "hidden",
                                                    },
                                                ]}
                                            >
                                                <View
                                                    style={[
                                                        {
                                                            width: "100%",
                                                            height: "100%",
                                                        },
                                                    ]}
                                                >
                                                    <View
                                                        style={{
                                                            position: "absolute",
                                                            backgroundColor:
                                                                currentCourse.color,
                                                            borderRadius: 6,
                                                            paddingHorizontal: 8,
                                                            paddingVertical: 2,
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                fontSize: 16,
                                                                color: dynamicColor,
                                                            }}
                                                        >
                                                            {libelle}
                                                        </Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            flexDirection:
                                                                currentCourse.height <=
                                                                17
                                                                    ? "row"
                                                                    : "column",
                                                            gap:
                                                                currentCourse.height <=
                                                                17
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
                                                            color: currentCourse.color,
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
                                                            fontSize: 15,
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
                                // <View key={i}></View>
                            );
                        })}
                </VerticalScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    page: { width: "100%", height },
    courses: {
        // marginHorizontal: 12,
    },
    coursesBox: {
        // gap: 18,
        // justifyContent: "space-between",

        padding: 24,
        position: "relative",
    },
});

/*


{!loading &&
                    sortedTimetableData?.map((day, i) => (
                        <View
                            key={day.date}
                            style={[
                                styles.coursesBox,
                                {
                                    width: "100%",
                                    height: height,
                                    backgroundColor: "#f5f5f5",
                                },
                            ]}
                        >
                            {day.courses.map((course) => (
                                <View key={course.webId} style={styles.courses}>
                                    <RoundedBox course={course} />
                                </View>
                            ))}
                        </View>
                    ))}



*/

