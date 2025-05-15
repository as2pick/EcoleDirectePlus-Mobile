import { useCallback, useEffect, useRef, useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { useFocusEffect, useNavigation, useTheme } from "@react-navigation/native";

import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import RoadFinish from "../../../../assets/svg/RoadFinish";
import { OverLoader } from "../../../components";
import VerticalScrollView from "../../../components/Layout/VerticalScrollView";
import { CONFIG } from "../../../constants/config";
import { GLOBALS_DATAS } from "../../../constants/device/globals";
import { timetableConfig } from "../../../constants/features/timetableConfig";

import { useUser } from "../../../context/UserContext";
import { storageServiceStates } from "../../../helpers/storageService";
import { routesNames } from "../../../router/config/routesNames";
import { addOpacityToCssRgb } from "../../../utils/colorGenerator";

let {
    screen: { height, width },
} = GLOBALS_DATAS;

height -= CONFIG.upper + 24; // ??? but works fine

const screenHeight = height;

export default function TimetableContent() {
    const { userAccesToken, sortedTimetableData, setSortedTimetableData } =
        useUser();

    const navigation = useNavigation();
    const theme = useTheme();

    const scrollViewRef = useRef(null);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showLoader, setShowLoader] = useState(false);
    const [timetableViewDims, setTimetableViewDims] = useState({
        width: 0,
        height: 0,
    });
    const [timetableCoreSuccessLoaded, setTimetableCoreSuccessLoaded] =
        useState(false);

    const dynamicOpacity = useSharedValue(0);
    const dynamicOpacityStyle = useAnimatedStyle(() => ({
        opacity: dynamicOpacity.value,
    }));

    useFocusEffect(
        useCallback(() => {
            if (!sortedTimetableData || sortedTimetableData.length === 0) {
                setLoading(true);
                storageServiceStates
                    .getter({ originKey: "timetable" })
                    .then((userTimetable) => {
                        setSortedTimetableData(userTimetable);
                        setLoading(false);
                    });
            }
        }, [userAccesToken, sortedTimetableData])
    );

    const activeDate = sortedTimetableData?.[currentIndex]?.iSODate || "";

    useEffect(() => {
        if (!timetableCoreSuccessLoaded) return;

        scrollViewRef.current.scrollToIndex(
            sortedTimetableData.findIndex((day) => day.date === CONFIG.dateNow),
            false
        );
        dynamicOpacity.value = withSpring(1, { duration: 1500 });
    }, [timetableCoreSuccessLoaded]);

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
            onLayout={() => setTimetableCoreSuccessLoaded(true)}
        >
            <Animated.View
                style={[
                    dynamicOpacityStyle,
                    {
                        margin: 24,
                        overflow: "hidden",
                        flex: 1,
                        height: screenHeight,
                        borderRadius: 23,
                        backgroundColor: theme.colors.bg.bg2,
                    },
                ]}
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
                            borderRadius: 50,
                            justifyContent: "center",
                            alignItems: "center",
                            overflow: "hidden",
                            bottom: 0,
                        }}
                        onLongPress={() =>
                            scrollViewRef.current.scrollToIndex(
                                sortedTimetableData.findIndex(
                                    (day) => day.date === CONFIG.dateNow
                                )
                            )
                        }
                    >
                        <Text
                            style={{
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
                        width: 60,
                        height: 60,
                        backgroundColor: "red",
                        zIndex: 100,
                    }}
                    onPress={() => {
                        console.log(
                            sortedTimetableData.findIndex(
                                (day) => day.date === CONFIG.dateNow
                            )
                        );
                        scrollViewRef.current.scrollToIndex(2, false);
                    }}
                /> */}

                <VerticalScrollView
                    arrayLength={sortedTimetableData?.length}
                    getIndex={(i) => setCurrentIndex(i)}
                    ref={scrollViewRef}
                >
                    {!loading &&
                        sortedTimetableData?.map((currentDay, index) => (
                            <DayShedule
                                key={index}
                                currentDay={currentDay}
                                navigation={navigation}
                                theme={theme}
                                timetableViewDims={{
                                    getter: timetableViewDims,
                                    setter: setTimetableViewDims,
                                }}
                                index={index}
                            />
                        ))}
                </VerticalScrollView>
            </Animated.View>
        </SafeAreaView>
    );
}

const CourseBox = ({ course, navigation, theme, timetableViewDims }) => {
    const [libelleLayout, setLibelleLayout] = useState(null);
    const [roomLayout, setRoomLayout] = useState(null);
    const [overlap, setOverlap] = useState(false);

    const libelleLayoutRef = useRef(false);
    const roomLayoutRef = useRef(false);

    useEffect(() => {
        if (libelleLayout && roomLayout) {
            const isOverlapping =
                roomLayout.x < libelleLayout.x + libelleLayout.width &&
                roomLayout.x + roomLayout.width > libelleLayout.x &&
                roomLayout.y < libelleLayout.y + libelleLayout.height &&
                roomLayout.y + roomLayout.height > libelleLayout.y;

            setOverlap(isOverlapping);
        }
    }, [libelleLayout, roomLayout]);
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

    const handleLibelleLayout = (e) => {
        if (!libelleLayoutRef.current) {
            setLibelleLayout(e.nativeEvent.layout);
            libelleLayoutRef.current = true;
        }
    };

    const handleRoomLayout = (e) => {
        if (!roomLayoutRef.current) {
            setRoomLayout(e.nativeEvent.layout);
            roomLayoutRef.current = true;
        }
    };

    return (
        <>
            <TouchableOpacity
                key={webId}
                style={[
                    {
                        height: `${height - 0.15}%`,
                        top: `${placing}%`,
                        width: "90%",
                        borderColor: color,
                        borderWidth: 1.8,
                        borderRadius: 16,
                        position: "absolute",
                        paddingHorizontal: 12,

                        paddingVertical:
                            height <= CONFIG.minCourseSize
                                ? timetableViewDims.height /
                                      CONFIG.minCourseSize /
                                      height +
                                  1
                                : CONFIG.minCourseSize,
                        overflow: "hidden",
                    },
                ]}
                onPress={() => {
                    navigation.navigate(
                        routesNames.client.timetable.course_details,
                        {
                            courseData: course,
                        }
                    );
                }}
            >
                {(isCancelled || isDispensed) && (
                    <View
                        style={{
                            position: "absolute",
                            zIndex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            top: 0,
                            bottom: 0,
                            right: 0,
                            left: 0,

                            backgroundColor: isCancelled
                                ? addOpacityToCssRgb(
                                      timetableConfig.cancelledColor,
                                      0.43
                                  )
                                : addOpacityToCssRgb(
                                      timetableConfig.dispensedColor,
                                      0.43
                                  ),
                        }}
                    >
                        <Text
                            style={{
                                paddingHorizontal: 14,
                                paddingVertical: 2,
                                backgroundColor: isCancelled
                                    ? timetableConfig.cancelledColor
                                    : timetableConfig.dispensedColor,
                                borderRadius: 50,
                                fontSize: 18,
                                borderColor: theme.colors.txt.txt1,
                                borderWidth: 1.2,
                                elevation: 14,
                            }}
                        >
                            {isCancelled ? "Annulé" : "Dispensé"}
                        </Text>
                    </View>
                )}
                <View
                    style={{
                        justifyContent: "space-between",
                        flex: 1,
                        opacity: 1,
                        // backgroundColor: "red",
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 13,
                                color: textColor,

                                backgroundColor: color,
                                borderRadius: 6,

                                paddingHorizontal: 8,
                                paddingVertical: 2,
                            }}
                            onLayout={handleLibelleLayout}
                        >
                            {libelle}
                        </Text>

                        <Text
                            style={{
                                color: color,
                                fontWeight: 600,
                                fontSize: 12,
                            }}
                            onLayout={handleRoomLayout}
                        >
                            {room}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 13,
                            }}
                        >
                            {teacher}
                        </Text>
                        <View
                            style={{
                                flexDirection: "row",
                                gap: height <= 17 ? 4.5 : 2,
                                alignItems: "center",
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: 300,
                                }}
                            >
                                {startCourse.time}
                            </Text>
                            {/* <View style={{ position: "absolute" }}> */}

                            {/* </View> */}
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: 300,
                                }}
                            >
                                {endCourse.time}
                            </Text>
                            <RoadFinish size={14} />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </>
    );
};

const DayShedule = ({
    currentDay,
    navigation,
    theme,
    timetableViewDims = { getter, setter },
    index,
}) => {
    return (
        <View
            key={index}
            style={{
                width: "100%",
                height: screenHeight - 100, // idk why but... works on other devices ?
                top: 20,

                alignItems: "center",
                position: "absolute",
                zIndex: 10,
            }}
            onLayout={(event) => {
                const { width, height } = event.nativeEvent.layout;
                timetableViewDims.setter({ width, height });
            }}
        >
            {currentDay?.courses.map((course) => (
                <CourseBox
                    key={course.webId}
                    course={course}
                    navigation={navigation}
                    theme={theme}
                    timetableViewDims={timetableViewDims.getter}
                ></CourseBox>
            ))}
        </View>
    );
};

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

