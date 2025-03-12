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

export default function TimetableContent({ route }) {
    const { theme } = route.params;

    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timetableDates, setTimetableDates] = useState(null);
    const [currentDay, setCurrentDay] = useState(null);
    const [timetableViewDims, setTimetableViewDims] = useState({
        width: 0,
        height: 0,
    });
    const [activeSelected, setActiveSelected] = useState(null);
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
        return <Text style={{ color: theme.colors.txt.txt1 }}>Loading...</Text>;
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
                                            color,
                                            placing,
                                            height,
                                        } = course;
                                        // console.log(
                                        //     isCancelled,
                                        //     isDispensed,
                                        //     isEdited,
                                        //     libelle
                                        // );

                                        const currentCourse =
                                            sortedTimetableData[index].courses[i];
                                        const dynamicColor = isDarkColor(color)
                                            ? "hsl(0, 100%, 100%)"
                                            : "hsl(0, 0%, 0%)";

                                        if (height <= CONFIG.minCourseSize) {
                                            console.log(course, "MIN !");
                                        }
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
                                                // onPress={() => {
                                                //     console.log("pressed", course);
                                                // }}
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

import React, { useRef, useState } from "react";
import { Animated, Button, StyleSheet, TextInput, View } from "react-native";

const App = () => {
    const [id, setId] = useState("");
    const animatedValues = useRef({}).current;

    const animateView = (viewId) => {
        if (animatedValues[viewId]) {
            Animated.timing(animatedValues[viewId], {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }).start();
        }
    };

    const getAnimatedStyle = (viewId) => {
        if (!animatedValues[viewId]) {
            animatedValues[viewId] = new Animated.Value(0);
        }

        return {
            opacity: animatedValues[viewId],
            transform: [
                {
                    translateY: animatedValues[viewId].interpolate({
                        inputRange: [0, 1],
                        outputRange: [100, 0],
                    }),
                },
            ],
        };
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Entrez l'ID de la vue"
                value={id}
                onChangeText={setId}
            />
            <Button title="Animer" onPress={() => animateView(id)} />
            <Animated.View style={[styles.box, getAnimatedStyle("4090")]} key="4090">
                </Animated.View>
                <Animated.View style={[styles.box, getAnimatedStyle("4091")]} key="4091">
                </Animated.View>
            </View>
        );
    };
    
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        input: {
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            marginBottom: 20,
            paddingHorizontal: 10,
        },
        box: {
            width: 100,
            height: 100,
            backgroundColor: "tomato",
            marginVertical: 10,
        },
    });
    
    export default App;
    
    

*/

