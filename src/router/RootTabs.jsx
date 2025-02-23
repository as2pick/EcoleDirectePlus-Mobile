import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useMemo } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import NavigationBottomBar from "../screens/navbar/NavigationBottomBar";
import clientScreens from "./display/client/indexClient";
const Tab = createBottomTabNavigator();

export default function RootTabs() {
    const screens = useMemo(() => {
        return clientScreens.map((screen, i) => (
            <Tab.Screen
                name={screen.screenName}
                component={screen.screenComponent}
                options={{
                    headerShown: screen.options?.headerShown ?? false,
                    ...screen.options,
                }}
                key={i}
            />
        ));
    }, [clientScreens]);

    return (
        <SafeAreaProvider>
            <Tab.Navigator
                tabBar={(props) => <NavigationBottomBar {...props} />}
                initialRouteName="Home"
            >
                {screens}
            </Tab.Navigator>
        </SafeAreaProvider>
    );
}

