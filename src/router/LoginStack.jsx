import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useMemo } from "react";
import authScreens from "./display/auth/indexAuth";

const Stack = createNativeStackNavigator();

export default function LoginStack() {
    const screens = useMemo(() => {
        return authScreens.map((screen, i) => (
            <Stack.Screen
                name={screen.screenName}
                component={screen.screenComponent}
                options={{
                    headerShown: screen.options?.headerShown ?? false,
                    ...screen.options,
                }}
                key={i}
            />
        ));
    }, [authScreens]);

    return <Stack.Navigator initialRouteName="Login">{screens}</Stack.Navigator>;
}

