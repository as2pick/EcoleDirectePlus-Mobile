import { useTheme } from "@react-navigation/native";
import { StyleSheet, Text } from "react-native";
import { UiStyles } from "./UiStyles";
export default function Title({ customStyle = {}, children }) {
    const { colors } = useTheme();
    const combinedStyles = StyleSheet.flatten([
        UiStyles.title,
        customStyle,
        { color: colors.txt.txt1 },
    ]);
    return (
        <Text style={[combinedStyles, { color: colors.txt.txt1 }]}>{children}</Text>
    );
}

