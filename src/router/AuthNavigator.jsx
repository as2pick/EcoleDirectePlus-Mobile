import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { MainLayout } from "../components";
import { useSingIn } from "../context/SignInContext";
import { useTheme } from "../context/ThemeContext";
import { useUser } from "../context/UserContext";
import SplashScreen from "../screens/Splash/SplashScreen";
import { THEMES_ASSOCIATIONS } from "../themes/themes";
import Auth from "./display/auth/Auth";
import Client from "./display/client/Client";

export default function AuthNavigator() {
    const { colorScheme } = useTheme();

    const { state } = useSingIn();
    const { isConnected, userAccesToken } = useUser();

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer theme={THEMES_ASSOCIATIONS[colorScheme]}>
                {state.isLoading ? (
                    <SplashScreen />
                ) : isConnected ? (
                    <MainLayout>
                        <Client />
                    </MainLayout>
                ) : (
                    <Auth />
                )}
            </NavigationContainer>
        </GestureHandlerRootView>
    );
}

