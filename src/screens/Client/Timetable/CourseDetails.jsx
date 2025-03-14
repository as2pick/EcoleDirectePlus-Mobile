import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import { Text } from "react-native";
import BellOffIcon from "../../../assets/svg/micro/BellOffIcon";
import ClockIcon from "../../../assets/svg/micro/ClockIcon";
import DoorOpenIcon from "../../../assets/svg/micro/DoorOpenIcon";
import HourglassIcon from "../../../assets/svg/micro/HourglassIcon";
import PenSquareIcon from "../../../assets/svg/micro/PenSquareIcon";
import PeoplesIcon from "../../../assets/svg/micro/PeoplesIcon";
import PersonIcon from "../../../assets/svg/micro/PersonIcon";
import TrashIcon from "../../../assets/svg/micro/TrashIcon";
import CustomTopHeader from "../../../components/CustomTopHeader";
import { toHoursMinutes, toMilliseconds } from "../../../utils/time";

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
    } = courseData;
    console.log(courseData);
    useFocusEffect(
        useCallback(() => {
            // focus
            return () => {
                // blured -> closed
            };
        }, [])
    );

    const courseTiming =
        toMilliseconds(endCourse.time) - toMilliseconds(startCourse.time);
    const [hours, minutes] = toHoursMinutes(courseTiming);
    const [date, time] = new Date().toISOString().split("T");
    const today = `${date}T${time.split(".").shift().slice(0, 5)}`;

    console.log(today);

    const [yS, mS, dS] = startCourse.date.split("-");
    const [yN, mN, dN] = today.split("T").shift().split("-");
    console.log(yS - yN, mS - mN, dS - dN); // :-)

    return (
        <>
            <CustomTopHeader
                headerTitle={"Retour à l'emploi du temps"}
                backArrow={{ color: "white", size: 24 }}
            />
            <Text style={{ color: colors.txt.txt1 }}>{`${libelle}`}</Text>
            <Text style={{ color: colors.txt.txt1 }}>{`${isCancelled}`}</Text>
            <Text style={{ color: colors.txt.txt1 }}>{`${isDispensed}`}</Text>
            <Text style={{ color: colors.txt.txt1 }}>{`${isEdited}`}</Text>
            <Text style={{ color: colors.txt.txt1 }}>{`${room}`}</Text>
            <Text style={{ color: colors.txt.txt1 }}>{`${teacher}`}</Text>
            <Text style={{ color: colors.txt.txt1 }}>{`${color}`}</Text>
            <Text style={{ color: colors.txt.txt1 }}>{`${placing}`}</Text>
            <Text style={{ color: colors.txt.txt1 }}>{`${height}`}</Text>
            <Text style={{ color: colors.txt.txt1 }}>{`${today}`}</Text>

            <Text
                style={{ color: colors.txt.txt1 }}
            >{`Timing: ${!hours ? `` : `${hours} heures et `}${minutes} minutes`}</Text>
            <PersonIcon />
            <DoorOpenIcon />
            <PeoplesIcon />
            <ClockIcon />
            <HourglassIcon />
            <BellOffIcon />
            <TrashIcon />
            <PenSquareIcon />
        </>
    );
}

