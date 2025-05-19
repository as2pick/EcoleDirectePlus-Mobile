import { createStackNavigator } from "@react-navigation/stack";
import { GLOBALS_DATAS } from "../../../constants/device/globals";
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

    return (
        <Stack.Navigator
            initialRouteName={content}
            screenOptions={{
                gestureEnabled: true,
                gestureDirection: "horizontal",
                gestureResponseDistance: width / 1.2, // beacause maybe
                headerShown: false,

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
                    gestureEnabled: false,
                }}
            />
            <Stack.Screen name={course_details} component={CourseDetails} />
        </Stack.Navigator>
    );
}

