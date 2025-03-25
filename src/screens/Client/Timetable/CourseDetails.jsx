import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import { Pressable, Text, View } from "react-native";

import BellOffIcon from "../../../assets/svg/micro/BellOffIcon";
import ClockIcon from "../../../assets/svg/micro/ClockIcon";
import DoorOpenIcon from "../../../assets/svg/micro/DoorOpenIcon";
import HourglassIcon from "../../../assets/svg/micro/HourglassIcon";
import PenSquareIcon from "../../../assets/svg/micro/PenSquareIcon";
import PeoplesIcon from "../../../assets/svg/micro/PeoplesIcon";
import PersonIcon from "../../../assets/svg/micro/PersonIcon";
import TrashIcon from "../../../assets/svg/micro/TrashIcon";
import { CustomTopHeader } from "../../../components";
import {
    getTimeInterval,
    toHoursMinutes,
    toMilliseconds,
} from "../../../utils/time";

export default function CourseDetails({ route }) {
    const { theme, courseData } = route.params;
    const { colors } = theme;

    const navigation = useNavigation();
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
    useFocusEffect(
        useCallback(() => {
            // focus
            return () => {
                // blured -> closed
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

    const courseTiming =
        toMilliseconds(endCourse.time) - toMilliseconds(startCourse.time);
    const [hours, minutes] = toHoursMinutes(courseTiming);
    const date = new Date().toISOString().slice(0, 10);
    const time = new Date().toLocaleTimeString("fr-FR").slice(0, 5);
    const today = `${date}T${time}`; // we do that beacause time is incorrect with raw toISOString
    const [intervalDays, intervalHours, intervalMinutes] = getTimeInterval(
        today,
        `${startCourse.date}T${startCourse.time}`
    );
    let startCourseTiming = "";

    if (intervalDays < 0) {
        startCourseTiming = `Il y a ${Math.abs(intervalDays)} jours`;
    } else {
        startCourseTiming = "Dans ";
        if (intervalDays > 0) {
            startCourseTiming += `${intervalDays} jours`;
        } else {
            if (intervalHours > 0) {
                startCourseTiming += `${intervalHours} heures`;
            }
            if (intervalMinutes > 0) {
                if (intervalHours > 0) {
                    startCourseTiming += ` et `;
                }
                startCourseTiming += `${intervalMinutes} minutes`;
            } else if (intervalMinutes === 0) {
                startCourseTiming += `${intervalMinutes} minutes`;
            } else {
                startCourseTiming = null;
            }
        }
    }

    let timing = "";

    if (hours > 0) {
        timing += `${hours} heure${hours > 1 ? "s" : ""}`;
    } else if (minutes > 0) {
        timing += `${minutes} minute${minutes > 1 ? "s" : 0}`;
    } else {
        timing = "Erreur lors de la lecture du temps";
    }
    console.log(!teacher || !room || !group);
    return (
        <View style={{ flex: 2, backgroundColor: colors.bg.bg2 }}>
            <CustomTopHeader
                headerTitle={"Retour à l'emploi du temps"}
                backArrow={{ color: "white", size: 24 }}
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
                        <Text
                            style={{
                                fontSize: 26,
                                color: textColor,
                            }}
                        >
                            {libelle}
                        </Text>
                    </View>
                    <View style={{ marginTop: "10%", gap: 8 }}>
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
                                        color: colors.txt.txt1,
                                        fontSize: 17.5,
                                        fontWeight: 600,
                                        marginLeft: 15,
                                    }}
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
                                        color: colors.txt.txt1,
                                        fontSize: 17.5,
                                        fontWeight: 600,
                                        marginLeft: 15,
                                    }}
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
                                        color: colors.txt.txt1,
                                        fontSize: 17.5,
                                        fontWeight: 600,
                                        marginLeft: 15,
                                    }}
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
                                        color: colors.txt.txt1,
                                        fontSize: 17.5,
                                        fontWeight: 600,
                                        marginLeft: 15,
                                    }}
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
                                        color: colors.txt.txt1,
                                        fontSize: 17.5,
                                        fontWeight: 600,
                                        marginLeft: 30,
                                    }}
                                >{`${timing}`}</Text>
                            </View>
                        </>
                    )}

                    <Separation />
                    {(teacher || room || group) && (
                        <>
                            <View
                                style={{
                                    flexDirection: "column",
                                    marginLeft: "12.5%",
                                    marginVertical: "7%",
                                    gap: 10,
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                    }}
                                >
                                    <PersonIcon />
                                    <Text
                                        style={{
                                            color: colors.txt.txt1,
                                            fontSize: 17.5,
                                            fontWeight: 600,
                                            marginLeft: 30,
                                        }}
                                    >{`${teacher}`}</Text>
                                </View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                    }}
                                >
                                    <DoorOpenIcon />
                                    <Text
                                        style={{
                                            color: colors.txt.txt1,
                                            fontSize: 17.5,
                                            fontWeight: 600,
                                            marginLeft: 30,
                                        }}
                                    >{`${room}`}</Text>
                                </View>
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
                                                color: colors.txt.txt1,
                                                fontSize: 17.5,
                                                fontWeight: 600,
                                                marginLeft: 30,
                                            }}
                                        >{`${group}`}</Text>
                                    </View>
                                )}
                            </View>
                            <Separation />
                        </>
                    )}
                </View>
                <View
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
                                color: colors.txt.txt1,
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
                                color: colors.txt.txt1,
                                fontSize: 18,
                                fontWeight: 450,
                            }}
                        >
                            Devoirs
                        </Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

