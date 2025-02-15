import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSingIn } from "../context/SignInContext";
import SplashScreen from "../screens/Splash/SplashScreen";
import { THEMES } from "../themes/themes";
import LoginStack from "./LoginStack";
import RootTabs from "./RootTabs";

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
    const [isDark, setIsDark] = useState(true);
    const { state } = useSingIn();

    const theme = isDark ? THEMES.etheral : THEMES.opulent; // theme handler

    return (
        <GestureHandlerRootView>
            <NavigationContainer theme={theme}>
                <Stack.Navigator
                    screenOptions={{
                        navigationBarColor: "rgba(0, 0, 0, 0)", // hide bad black safe zones
                        navigationBarTranslucent: true,
                    }}
                >
                    {state.isLoading ? (
                        <Stack.Screen
                            name="Splash"
                            component={SplashScreen}
                            options={{ headerShown: false }}
                        />
                    ) : state.userToken == null ? (
                        <Stack.Screen
                            name="Auth"
                            component={LoginStack}
                            options={{ headerShown: false }}
                        />
                    ) : (
                        <Stack.Screen
                            name="Main"
                            component={RootTabs}
                            options={{ headerShown: false }}
                        />
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </GestureHandlerRootView>
    );
}

