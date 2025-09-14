import { createNativeStackNavigator } from "@react-navigation/native-stack";
import mapScreens from "../../helpers/mapScreens";
import appNavigatorOrganisation from "./indexClient";

const Stack = createNativeStackNavigator();

export default function Client() {
    const screens = mapScreens({
        navMethod: Stack,
        screenArray: appNavigatorOrganisation,
    });

    return (
        <Stack.Navigator screenOptions={{ headerShown: false, animation: "fade" }}>
            {screens}
        </Stack.Navigator>
    );
}

