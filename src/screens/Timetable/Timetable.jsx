import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import RoundedBox from "../../components/RoundedBox";
import VerticalScrollView from "../../components/VerticalScrollView";
import { GLOBALS_DATAS } from "../../constants/device/globals";
import { useUser } from "../../context/UserContext";
import getTimetable from "../../resolver/timetable";

const {
    screen: { height, width },
} = GLOBALS_DATAS;

export default function Timetable() {
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timetableDates, setTimetableDates] = useState(null);
    const [currentDay, setCurrentDay] = useState(null);

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
                    setTimetableDates(Object.keys(userTimetable));
                });
            }
        }, [userAccesToken, sortedTimetableData])
    );

    useEffect(() => {
        if (!sortedTimetableData || !timetableDates) return;
        setCurrentDay(sortedTimetableData[timetableDates[currentIndex]]);
    }, [currentIndex, sortedTimetableData, timetableDates]);

    useEffect(() => {
        if (!sortedTimetableData) return;
        setLoading(false);
    }, [sortedTimetableData]);

    if (loading) {
        return <Text>Loading...</Text>;
    }

    return (
        <SafeAreaView style={{ position: "absolute", width: width }}>
            <VerticalScrollView
                arrayLength={sortedTimetableData?.length}
                getIndex={(i) => setCurrentIndex(i)}
            >
                {!loading &&
                    sortedTimetableData?.map((day, i) => (
                        <View
                            key={day.date}
                            style={[
                                styles.coursesBox,
                                {
                                    width: "100%",
                                    height: height,
                                    backgroundColor: "#f5f5f5", // Si tu veux un fond pour mieux visualiser
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
            </VerticalScrollView>
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

{
    /* {currentDay.courses.map((course, index) => (
    <View key={index}>
        <Text>{course.libelle}</Text>
        <Text>{course.teacher}</Text>
        <Text>{course.room}</Text>
        <Text>
            {course.startCourse.time} - {course.endCourse.time}
        </Text>
    </View>
))} */
}

