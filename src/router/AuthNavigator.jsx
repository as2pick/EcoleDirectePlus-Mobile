import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MainLayout } from "../components";
import { useSingIn } from "../context/SignInContext";
import { useUser } from "../context/UserContext";
import SplashScreen from "../screens/Splash/SplashScreen";
import { THEMES } from "../themes/themes";
import { routesNames } from "./config/routesNames";
import Auth from "./display/auth/Auth";
import Client from "./display/client/Client";

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
    const { state } = useSingIn();
    const { isConnected, userAccesToken } = useUser();
    const {
        navigators: { authentification, root, splash, settings },
    } = routesNames;
    const [theme, setTheme] = useState(THEMES.etheral);

    // const navigation = useNavigation();
    // setDefaultProps(Text, {
    //     style: [theme.fonts.regular, { color: theme.colors.txt.txt1 }],
    // });
    // setDefaultProps(TextInput, {
    //     style: [theme.fonts.regular, { color: theme.colors.txt.txt1 }],
    // });
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

