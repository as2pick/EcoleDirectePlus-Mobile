import { useTheme } from "@react-navigation/native";
import { Text } from "react-native";
import { UiStyles } from "./UiStyles";
export default function Title({ customStyle = {}, children }) {
    const { colors } = useTheme();
    return (
        <Text
            style={[
                customStyle ? customStyle : UiStyles.title,
                { color: colors.txt.txt1 },
            ]}
        >
            {children}
        </Text>
    );
}

