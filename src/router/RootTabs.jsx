import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import NavigationBottomBar from "../screens/navbar/NavigationBottomBar";
import clientScreens from "./display/client/indexClient";
const Tab = createBottomTabNavigator();

export default function RootTabs() {
    return (
        <SafeAreaProvider>
            <Tab.Navigator tabBar={(props) => <NavigationBottomBar {...props} />}>
                {clientScreens.map((screen, i) => (
                    <Tab.Screen
                        name={screen.screenName}
                        component={screen.screenComponent}
                        options={{ ...screen.options, headerShown: false }}
                        key={i}
                    />
                ))}
            </Tab.Navigator>
        </SafeAreaProvider>
    );
}

