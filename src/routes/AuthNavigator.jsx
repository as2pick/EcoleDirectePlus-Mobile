import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSingIn } from "../context/SignInContext";
import { useUser } from "../context/UserContext";
import SplashScreen from "../screens/Splash/SplashScreen";
import LoginStack from "./LoginStack";
import RootTabs from "./RootTabs";

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
    const { userAccesToken } = useUser();
    const { state } = useSingIn();

    return (
        <NavigationContainer>
            <Stack.Navigator>
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
    );
}

