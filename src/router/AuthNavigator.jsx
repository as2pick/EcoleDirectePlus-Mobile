import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSingIn } from "../context/SignInContext";
import { useUser } from "../context/UserContext";
import SplashScreen from "../screens/Splash/SplashScreen";
import { THEMES } from "../themes/themes";
import LoginStack from "./LoginStack";
import RootTabs from "./RootTabs";

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
    const [isDark, setIsDark] = useState(true);
    const { state } = useSingIn();
    const { isConnected } = useUser();

    const theme = isDark ? THEMES.etheral : THEMES.opulent; // theme handler

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
                        <Stack.Screen name="Splash" component={SplashScreen} />
                    ) : isConnected ? (
                        <Stack.Screen name="Main" component={RootTabs} />
                    ) : (
                        <Stack.Screen name="Auth" component={LoginStack} />
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </GestureHandlerRootView>
    );
}

