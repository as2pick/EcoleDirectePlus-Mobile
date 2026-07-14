import { Text } from "@/components";
import ActiveCourseCard from "@/features/home/components/ActiveCourseCard";
import GeneralAveragePreview from "@/features/home/components/GeneralAveragePreview";
import HomeworksPreview from "@/features/home/components/HomeworksPreview";
import LastGrades from "@/features/home/components/LastGrades";
import getGreetingMessage from "@/features/home/utils/getGreetingMessage";
import { useTimetable } from "@/features/timetable";
import { useCurrentTime } from "@/hooks/useCurrentTime";
import { useSignIn } from "@/hooks/useSignIn";
import { useUserStore } from "@/hooks/useUserStore";
import { getTodayDateString } from "@/utils/date";
import {
    convertTimeHoursMinToMinutes,
    getTimeInterval,
    isInInterval,
} from "@/utils/time";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";

export default function HomeScreen() {
    const { signOut } = useSignIn();
    const navigation = useNavigation();

    const token = useUserStore((state) => state.token);
    const { name } = useUserStore((state) => state.profile);
    const { data: timetableData, isLoading, isError } = useTimetable(token);
    const currentTime = useCurrentTime();
    const [greetingMessage] = useState(getGreetingMessage);

    const activeDate = useMemo(() => {
        if (!timetableData) return null;
        return (
            timetableData.find(({ date }) => date === getTodayDateString()) ?? null
        );
    }, [timetableData]);

    const activeCourse = useMemo(() => {
        if (!activeDate) return null;
        return (
            activeDate.courses.find(({ startCourse, endCourse }) =>
                isInInterval(currentTime.time, startCourse.time, endCourse.time)
            ) ?? null
        );
    }, [activeDate, currentTime.time]);

    const progression = useMemo(() => {
        if (!activeCourse) return 0;
        const [activeMinutes, startMinutes, endMinutes] =
            convertTimeHoursMinToMinutes(
                currentTime.time,
                activeCourse.startCourse.time,
                activeCourse.endCourse.time
            );
        return parseFloat(
            ((activeMinutes - startMinutes) / (endMinutes - startMinutes)).toFixed(4)
        );
    }, [activeCourse, currentTime.time]);

    const { nextCourse, nextDate } = useMemo(() => {
        if (!activeDate) return { nextCourse: null, nextDate: null };

        const activeCourseIndex = activeCourse
            ? activeDate.courses.indexOf(activeCourse)
            : -1;

        const isLastCourseOfTheDay =
            activeCourseIndex === -1 ||
            activeCourseIndex === activeDate.courses.length - 1;

        if (isLastCourseOfTheDay) {
            const activeDateIndex = timetableData.indexOf(activeDate);
            const hasNoNextDate =
                activeDateIndex === -1 ||
                activeDateIndex === timetableData.length - 1;

            if (hasNoNextDate) {
                return { nextCourse: null, nextDate: null };
            }
            console.log(`${currentTime.date}T${currentTime.time}`);
            const followingDate = timetableData[activeDateIndex + 1];
            return {
                nextCourse: {
                    course: followingDate.courses[0] ?? null,
                    timeRemaining: getTimeInterval(
                        `${currentTime.date}T${currentTime.time}`,
                        `${followingDate.courses[0].startCourse.date}T${followingDate.courses[0].startCourse.time}`
                    ),
                },
                nextDate: followingDate,
            };
        }
        const nextCourse = activeDate.courses[activeCourseIndex + 1];

        return {
            nextCourse: {
                course: nextCourse,
                timeRemaining: getTimeInterval(
                    `${currentTime.date}T${currentTime.time}`,
                    `${nextCourse.startCourse.date}T${nextCourse.courses[0].startCourse.time}`
                ),
            },
            nextDate: activeDate,
        };
    }, [activeDate, activeCourse, timetableData]);

    return (
        <LinearGradient
            colors={["hsla(228, 70%, 18%, 1)", "hsla(228, 30%, 8%, 0.85)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.3 }}
            style={{ flex: 1, paddingHorizontal: 20 }}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                bounces={false}
                scrollEventThrottle={16}
                overScrollMode="never"
            >
                <View style={{ marginTop: "25%", marginBottom: 28 }}>
                    <Text size={26} color="hsla(1, 0%, 100%, 0.4)">
                        {greetingMessage}
                    </Text>
                    <Text size={38}>{name}</Text>
                </View>
                <View style={{ alignItems: "center", gap: 20 }}>
                    <ActiveCourseCard
                        progression={progression}
                        activeCourse={activeCourse}
                        nextCourse={nextCourse}
                    />
                    <GeneralAveragePreview />

                    <LastGrades />
                    <HomeworksPreview />
                </View>
            </ScrollView>
        </LinearGradient>
    );
}

