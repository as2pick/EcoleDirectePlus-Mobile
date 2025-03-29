import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { routesNames } from "./config/routesNames";
import authScreens from "./display/auth/indexAuth";
import mapScreens from "./helpers/mapScreens";

const Stack = createNativeStackNavigator();

export default function LoginStack() {
    const screens = mapScreens({ navMethod: Stack, screenArray: authScreens });

    return (
        <Stack.Navigator initialRouteName={routesNames.auth.login}>
            {screens}
        </Stack.Navigator>
    );
}

