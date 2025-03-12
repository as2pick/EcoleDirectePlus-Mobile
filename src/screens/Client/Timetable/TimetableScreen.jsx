import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import CourseDetails from "./CourseDetails";
import TimetableContent from "./TimetableContent";

export default function TimetableScreen({ theme }) {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="timetable_content">
            <Stack.Screen
                name="timetable_content"
                component={TimetableContent}
                initialParams={{ theme }}
                options={{
                    headerShown: false,
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

