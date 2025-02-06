import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import LoginScreen from "../screens/Login/LoginScreen";

const Stack = createNativeStackNavigator();

export default function LoginStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ title: "Log in" }}
            />
        </Stack.Navigator>
    );
}

