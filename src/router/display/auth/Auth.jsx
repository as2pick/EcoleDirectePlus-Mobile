import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { routesNames } from "../../config/routesNames";
import mapScreens from "../../helpers/mapScreens";
import authScreens from "./indexAuth";

const Stack = createNativeStackNavigator();

export default function Auth() {
    const screens = mapScreens({ navMethod: Stack, screenArray: authScreens });
    return (
        <Stack.Navigator
            initialRouteName={routesNames.auth.login}
            screenOptions={{ animation: "slide_from_right" }}
        >
            {screens}
        </Stack.Navigator>
    );
}

