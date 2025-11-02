import { useTheme } from "@react-navigation/native";
import { StyleSheet, Text } from "react-native";
import { UiStyles } from "./UiStyles";

export default function Title({ customStyle = {}, children }) {
    const { colors } = useTheme();
    const combinedStyles = StyleSheet.flatten([UiStyles.title, customStyle]);
    return (
        <Text style={combinedStyles} numberOfLines={1}>
            {children}
        </Text>
    );
}

