import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState } from "react";
import { Text, TextInput } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSingIn } from "../context/SignInContext";
import { useUser } from "../context/UserContext";
import SettingsScreen from "../screens/Settings/SettingsScreen";
import SplashScreen from "../screens/Splash/SplashScreen";
import { THEMES } from "../themes/themes";
import setDefaultProps from "../utils/setDefaultProps";
import LoginStack from "./LoginStack";
import RootTabs from "./RootTabs";
import { routesNames } from "./config/routesNames";

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
    const { state } = useSingIn();
    const { isConnected } = useUser();
    const {
        navigators: { authentification, root, splash, settings },
    } = routesNames;
    const [theme, setTheme] = useState(THEMES.etheral);
    console.log(theme);
    setDefaultProps(Text, {
        style: [theme.fonts.regular, { color: theme.colors.txt.txt1 }],
    });
    setDefaultProps(TextInput, {
        style: [theme.fonts.regular, { color: theme.colors.txt.txt1 }],
    });
    return (
        <GestureHandlerRootView>
            <NavigationContainer theme={theme}>
                <Stack.Navigator
                    screenOptions={{
                        navigationBarColor: "rgba(0, 0, 0, 0)", // hide bad black safe zones
                        navigationBarTranslucent: true,
                        headerShown: false,
                    }}
                >
                    {state.isLoading ? (
                        <Stack.Screen name={splash} component={SplashScreen} />
                    ) : isConnected ? (
                        <Stack.Screen name={root} component={RootTabs} />
                    ) : (
                        <Stack.Screen
                            name={authentification}
                            component={LoginStack}
                        />
                    )}
                    <Stack.Screen name={settings} component={SettingsScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </GestureHandlerRootView>
    );
}

