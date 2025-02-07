import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import HomeScreen from "../Home/HomeScreen";
import LoginScreen from "../Login/LoginScreen";

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Login" component={LoginScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

