import { createStackNavigator } from "@react-navigation/stack";
import mapScreens from "../../helpers/mapScreens";
import appNavigatorOrganisation from "./indexClient";

const Stack = createStackNavigator();

export default function Client() {
    const screens = mapScreens({
        navMethod: Stack,
        screenArray: appNavigatorOrganisation,
    });

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {screens}
        </Stack.Navigator>
    );
}

