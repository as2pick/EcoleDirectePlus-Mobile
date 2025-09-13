// TimetableScreen.js
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GLOBALS_DATAS } from "../../../constants/device/globals";
import { routesNames } from "../../../router/config/routesNames";
import CourseDetails from "./CourseDetails";
import TimetableContent from "./TimetableContent";

const Stack = createNativeStackNavigator();

export default function TimetableScreen() {
    const { width } = GLOBALS_DATAS.screen;
    const {
        client: {
            timetable: { course_details, content },
        },
    } = routesNames;

    return (
        <Stack.Navigator
            initialRouteName={content}
            screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
            }}
        >
            <Stack.Screen
                name={content}
                component={TimetableContent}
                options={{ gestureEnabled: false }}
            />
            <Stack.Screen name={course_details} component={CourseDetails} />
        </Stack.Navigator>
    );
}

