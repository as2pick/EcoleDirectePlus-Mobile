import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import authScreens from "./display/auth/indexAuth";

const Stack = createNativeStackNavigator();

export default function LoginStack() {
    return (
        <Stack.Navigator>
            {authScreens.map((screen, i) => (
                <Stack.Screen
                    name={screen.screenName}
                    component={screen.screenComponent}
                    options={screen.options}
                    key={i}
                />
            ))}
        </Stack.Navigator>
    );
}

