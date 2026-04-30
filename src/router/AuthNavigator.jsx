import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { MainLayout } from "../components";
import { useSingIn } from "../context/SignInContext";
import { useTheme } from "../context/ThemeContext";
import { useUser } from "../context/UserContext";
import SplashScreen from "../screens/Splash/SplashScreen";
import Auth from "./display/auth/Auth";
import Client from "./display/client/Client";

export default function AuthNavigator() {
    const { theme } = useTheme();

    const { state } = useSingIn();
    const { isConnected } = useUser();

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer theme={theme}>
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

