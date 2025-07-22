import { createStackNavigator } from "@react-navigation/stack";
import { routesNames } from "../../config/routesNames";
import mapScreens from "../../helpers/mapScreens";
import authScreens from "./indexAuth";

const Stack = createStackNavigator();

export default function Auth() {
    const screens = mapScreens({ navMethod: Stack, screenArray: authScreens });

    return (
        <Stack.Navigator initialRouteName={routesNames.auth.login}>
            {screens}
        </Stack.Navigator>
    );
}

