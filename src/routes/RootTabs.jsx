import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import HomeScreen from "../screens/Home/HomeScreen";
import TimetableScreen from "../screens/Timetable/Timetable";
const Tab = createBottomTabNavigator();

export default function MainTabs() {
    return (
        <SafeAreaProvider>
            <Tab.Navigator>
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen
                    name="Timetable"
                    component={TimetableScreen}
                    options={{ headerShown: false }}
                />
            </Tab.Navigator>
        </SafeAreaProvider>
    );
}

