import { NavigationContainer } from "@react-navigation/native";
import * as Network from "expo-network";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { MainLayout } from "../components";
import { useGlobalApp } from "../context/GlobalAppContext";
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
    const { setActiveNetworkStatus } = useGlobalApp();

    useEffect(() => {
        const initializeNetwork = async () => {
            try {
                const connectionStatus = await Network.getNetworkStateAsync();
                const airplaneStatus = await Network.isAirplaneModeEnabledAsync();

                if (
                    connectionStatus.isConnected &&
                    connectionStatus.isInternetReachable
                ) {
                    console.log("### ONLINE");
                } else {
                    console.log("### OFFLINE");
                }

                setActiveNetworkStatus({
                    ...connectionStatus,
                    inAirplaneMode: airplaneStatus,
                });
            } catch (error) {
                console.error("Error when init network:", error);
            }
        };

        const subscription = Network.addNetworkStateListener((networkData) => {
            console.log("Connection change:", networkData);
            setActiveNetworkStatus((prevState) => ({
                ...prevState,
                ...networkData,
            }));
        });

        initializeNetwork();

        return () => {
            if (subscription && subscription.remove) {
                subscription.remove();
            }
        };
    }, [setActiveNetworkStatus]);

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

