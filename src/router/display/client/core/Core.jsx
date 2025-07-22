import { createStackNavigator } from "@react-navigation/stack";
import { routesNames } from "../../../config/routesNames";
import mapScreens from "../../../helpers/mapScreens";
import coreClientScreen from "./indexClientCore";

const Stack = createStackNavigator();

export default function Core() {
    const screens = mapScreens({ navMethod: Stack, screenArray: coreClientScreen });

    return (
        <Stack.Navigator initialRouteName={routesNames.navigators.settings}>
            {screens}
        </Stack.Navigator>
    );
}

