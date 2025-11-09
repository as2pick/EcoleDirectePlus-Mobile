import { useTheme } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { UiStyles } from "./UiStyles";
import Text from "./core/Text";

export default function Subtitle({ children, customStyle = {} }) {
    const { colors } = useTheme();

    const combinedStyles = StyleSheet.flatten([UiStyles.subtitle, customStyle]);

    return (
        <Text
            style={combinedStyles}
            accessible={true}
            accessibilityRole="text"
            size={18}
            weight="normal"
        >
            {children}
        </Text>
    );
}

