import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import HomeScreen from "../screens/Home/HomeScreen";
const Tab = createBottomTabNavigator();

export default function MainTabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeScreen} />
        </Tab.Navigator>
    );
}

