import { Text } from "react-native";
import { UiStyles } from "./UiStyles";
export default function Title({ customStyle = {}, children }) {
    const { colors } = useTheme();
    return (
        <Text style={[UiStyles.title, customStyle, { color: colors.txt.txt1 }]}>
            {children}
        </Text>
    );
}

