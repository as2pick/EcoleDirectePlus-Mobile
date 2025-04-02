import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { GLOBALS_DATAS } from "../../../constants/device/globals";
import { useAppSettings } from "../../../context/AppSettingsContext";
import { routesNames } from "../../../router/config/routesNames";
import CourseDetails from "./CourseDetails";
import TimetableContent from "./TimetableContent";

const Stack = createStackNavigator();

export default function TimetableScreen() {
    const { width } = GLOBALS_DATAS.screen;
    const {
        client: {
            timetable: { course_details, content },
        },
    } = routesNames;
    const { isDarkTheme } = useAppSettings();

    useEffect(() => {
        console.log(isDarkTheme, "daktheme");
    }, [isDarkTheme]);
    return (
        <Stack.Navigator
            initialRouteName={content}
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
                name={content}
                component={TimetableContent}
                options={{
                    headerShown: false,
                    gestureEnabled: false,
                }}
            />
            <Stack.Screen
                name={course_details}
                component={CourseDetails}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
}

