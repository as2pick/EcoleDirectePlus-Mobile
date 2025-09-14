import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { routesNames } from "../../../config/routesNames";
import mapScreens from "../../../helpers/mapScreens";
import coreClientScreen from "./indexClientCore";

const Stack = createNativeStackNavigator();

export default function Core() {
    const screens = mapScreens({ navMethod: Stack, screenArray: coreClientScreen });

    return (
        <Stack.Navigator
            initialRouteName={routesNames.navigators.settings}
            screenOptions={{ animation: "slide_from_bottom" }}
        >
            {screens}
        </Stack.Navigator>
    );
}

