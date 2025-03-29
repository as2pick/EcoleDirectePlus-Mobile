import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSingIn } from "../context/SignInContext";
import { useUser } from "../context/UserContext";
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
        navigators: { authentification, root, splash },
    } = routesNames;

    const theme = THEMES.etheral; // theme handler

    setDefaultProps(Text, {
        style: [theme.fonts.regular],
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
                </Stack.Navigator>
            </NavigationContainer>
        </GestureHandlerRootView>
    );
}

