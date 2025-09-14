import { useTheme } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text } from "react-native";
import { UiStyles } from "./UiStyles";

export default function Subtitle({ children, customStyle = {} }) {
    const { colors } = useTheme();

    const combinedStyles = StyleSheet.flatten([UiStyles.subtitle, customStyle]);

    return (
        <Text style={combinedStyles} accessible={true} accessibilityRole="text">
            {children}
        </Text>
    );
}

