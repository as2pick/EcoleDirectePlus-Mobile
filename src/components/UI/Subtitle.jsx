import { useTheme } from "@react-navigation/native";
import { Text } from "react-native";
import { UiStyles } from "./UiStyles";

export default function Subtitle({ children }) {
    const { colors } = useTheme();
    return (
        <Text style={[UiStyles.subtitle, { color: colors.txt.txt1 }]}>
            {children}
        </Text>
    );
}

