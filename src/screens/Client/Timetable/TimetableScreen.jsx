import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { GLOBALS_DATAS } from "../../../constants/device/globals";
import CourseDetails from "./CourseDetails";
import TimetableContent from "./TimetableContent";

const Stack = createStackNavigator();

export default function TimetableScreen({ theme }) {
    const { width } = GLOBALS_DATAS.screen;
    return (
        <Stack.Navigator
            initialRouteName="timetable_content"
            screenOptions={{
                gestureEnabled: true,
                gestureDirection: "horizontal",
                gestureResponseDistance: width / 1.2, // beacause maybe

                cardStyleInterpolator: ({ current, layouts }) => ({
                    cardStyle: {
                        transform: [
                            {
                                translateX: current.progress.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [layouts.screen.width, 0],
                                    extrapolateRight: "clamp",
                                }),
                            },
                        ],
                    },
                }),
            }}
        >
            <Stack.Screen
                name="timetable_content"
                component={TimetableContent}
                initialParams={{ theme }}
                options={{
                    headerShown: false,
                    gestureEnabled: false,
                }}
            />
            <Stack.Screen
                name="timetable_course_detail"
                component={CourseDetails}
                initialParams={{ theme }}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
}

