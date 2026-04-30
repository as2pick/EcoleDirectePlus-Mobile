<<<<<<< HEAD
import { useTheme } from "../../context/ThemeContext";
=======
import React from "react";
import { StyleSheet, Text } from "react-native";
>>>>>>> main
import { UiStyles } from "./UiStyles";
import Text from "./core/Text";

<<<<<<< HEAD
export default function Subtitle({ children, ...props }) {
    const { theme } = useTheme();
=======
export default function Subtitle({ children, customStyle = {} }) {
    const combinedStyles = StyleSheet.flatten([UiStyles.subtitle, customStyle]);
>>>>>>> main

    return (
        <Text
            style={UiStyles.subtitle}
            color={theme.colors.main}
            preset="title2"
            oneLine
            {...props}
        >
            {children}
        </Text>
    );
}

