import { useFocusEffect, useTheme } from "@react-navigation/native";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";

import BellOffIcon from "../../../../assets/svg/micro/BellOffIcon";
import ClockIcon from "../../../../assets/svg/micro/ClockIcon";
import DoorOpenIcon from "../../../../assets/svg/micro/DoorOpenIcon";
import HourglassIcon from "../../../../assets/svg/micro/HourglassIcon";
import PenSquareIcon from "../../../../assets/svg/micro/PenSquareIcon";
import PeoplesIcon from "../../../../assets/svg/micro/PeoplesIcon";
import PersonIcon from "../../../../assets/svg/micro/PersonIcon";
import TrashIcon from "../../../../assets/svg/micro/TrashIcon";
import { CustomTopHeader, SwipeBackWrapper } from "../../../components";
import { Text } from "../../../components/Ui/core";
import { toHoursMinutes, toMilliseconds } from "../../../utils/time";

export default function CourseDetails({ route }) {
    const { courseData } = route.params;
    const { colors } = useTheme();

    const [now, setNow] = useState(moment());
    const [startCourseTiming, setStartCourseTiming] = useState("");

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
    } = courseData;

    const courseTiming =
        toMilliseconds(endCourse.time) - toMilliseconds(startCourse.time);
    const [hours, minutes] = toHoursMinutes(courseTiming);
    const startCourseDateTime = moment(`${startCourse.date} ${startCourse.time}`);

    const [intervalDays, intervalHours, intervalMinutes] = [
        startCourseDateTime.diff(now, "days"),
        startCourseDateTime.diff(now, "hours") % 24,
        startCourseDateTime.diff(now, "minutes") % 60,
    ];

    useFocusEffect(
        useCallback(() => {
            // Focus

            return () => {
                // Blur -> closed
            };
        }, [])
    );
    const Separation = useCallback(
        () => (
            <View
                style={{
                    alignItems: "center",
                }}
            >
                <View
                    style={{
                        width: "85%",
                        height: 2,
                        backgroundColor: colors.bg.bg4,
                    }}
                />
            </View>
        ),

        []
    );

    const startCourseTimingCat = {
        jour: intervalDays,
        heure: intervalHours,
        minute: intervalMinutes,
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(moment());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let timingMessage = "";

        if (intervalDays <= 0 && intervalHours <= 0 && intervalMinutes <= 0) {
            timingMessage += "Il y a ";

            Object.entries(startCourseTimingCat).forEach(([timingName, value]) => {
                if (value < 0) {
                    value = Math.abs(value);
                    timingMessage += `${value} ${timingName}${value > 1 ? "s" : ""} `;
                }
            });
        } else {
            timingMessage += "Dans ";

            Object.entries(startCourseTimingCat).forEach(([timingName, value]) => {
                if (value > 0) {
                    timingMessage += `${value} ${timingName}${value > 1 ? "s" : ""} `;
                }
            });
        }

        setStartCourseTiming(timingMessage.trim());
    }, [now.format("HH:mm")]);

    let timing = "";

    if (hours > 0) {
        timing += `${hours} heure${hours > 1 ? "s" : ""}`;
    } else if (minutes > 0) {
        timing += `${minutes} minute${minutes > 1 ? "s" : 0}`;
    } else {
        timing = "Erreur lors de la lecture du temps";
    }
    return (
        <SwipeBackWrapper>
            <View style={{ flex: 1, backgroundColor: colors.background }}>
                <CustomTopHeader
                    headerTitle={"Retour à l'emploi du temps"}
                    backArrow={{ color: colors.contrast, size: 24 }}
                    height={33}
                    backgroundColor={colors.background}
                />
                <View
                    style={{
                        justifyContent: "space-evenly",
                        flex: 1,
                        marginVertical: "3%",
                    }}
                >
                    <View
                        style={{
                            alignItems: "center",
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: color,
                                borderRadius: 6,

                                paddingHorizontal: 8,
                                paddingVertical: 2,
                            }}
                        >
                            <Text preset="h2" color={textColor}>
                                {libelle}
                            </Text>
                        </View>
                        <View
                            style={{
                                marginTop: "10%",
                                gap: 8,
                                alignItems: "center",
                            }}
                        >
                            {startCourseTiming && (
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                    }}
                                >
                                    <ClockIcon />
                                    <Text
                                        style={{
                                            marginLeft: 15,
                                        }}
                                        preset="title1"
                                    >{`${startCourseTiming}`}</Text>
                                </View>
                            )}
                            {isCancelled && (
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                    }}
                                >
                                    <TrashIcon />
                                    <Text
                                        style={{
                                            marginLeft: 15,
                                        }}
                                        preset="h3"
                                    >{`Annulé`}</Text>
                                </View>
                            )}
                            {isEdited && (
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                    }}
                                >
                                    <PenSquareIcon />
                                    <Text
                                        style={{
                                            marginLeft: 15,
                                        }}
                                        preset="h3"
                                    >{`Modifié`}</Text>
                                </View>
                            )}
                            {isDispensed && (
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                    }}
                                >
                                    <BellOffIcon />
                                    <Text
                                        style={{
                                            marginLeft: 15,
                                        }}
                                        preset="h3"
                                    >{`Dispensé`}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                    <View>
                        {timing && (
                            <>
                                <Separation />
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        marginLeft: "12.5%",
                                        marginVertical: "7%",
                                    }}
                                >
                                    <HourglassIcon />
                                    <Text
                                        style={{
                                            marginLeft: 30,
                                        }}
                                        preset="label1"
                                    >{`${timing}`}</Text>
                                </View>
                            </>
                        )}

                        <Separation />
                        <View
                            style={{
                                flexDirection: "column",
                                marginLeft: "12.5%",
                                marginVertical: "7%",
                                gap: 10,
                            }}
                        >
                            {teacher && (
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                    }}
                                >
                                    <PersonIcon />
                                    <Text
                                        style={{
                                            marginLeft: 30,
                                        }}
                                        preset="label1"
                                        oneLine
                                    >{`${teacher}`}</Text>
                                </View>
                            )}
                            {room && (
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                    }}
                                >
                                    <DoorOpenIcon />
                                    <Text
                                        style={{
                                            marginLeft: 30,
                                        }}
                                        preset="label1"
                                    >{`${room}`}</Text>
                                </View>
                            )}
                            {group && (
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                    }}
                                >
                                    <PeoplesIcon />
                                    <Text
                                        style={{
                                            marginLeft: 30,
                                        }}
                                        preset="label1"
                                    >{`${group}`}</Text>
                                </View>
                            )}
                        </View>
                        {(teacher || room || group) && <Separation />}
                    </View>
                    {/* <View
                    style={{
                        marginTop: 15,
                        flexDirection: "row",
                        gap: "10%",
                        justifyContent: "center",
                    }}
                >
                    <Pressable
                        style={{
                            backgroundColor: colors.bg.bg6,
                            paddingHorizontal: 18,
                            paddingVertical: 12,
                            borderRadius: 50,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 18,
                                textAlign: "center",
                                fontWeight: 450,
                            }}
                        >
                            Contenu
                        </Text>
                    </Pressable>
                    <Pressable
                        style={{
                            backgroundColor: colors.bg.bg6,
                            paddingHorizontal: 21,
                            paddingVertical: 12,
                            borderRadius: 50,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: 450,
                            }}
                        >
                            Devoirs
                        </Text>
                    </Pressable>
                </View> */}
                </View>
            </View>
        </SwipeBackWrapper>
    );
}

