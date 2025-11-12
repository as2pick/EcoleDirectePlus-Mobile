import { useTheme } from "../../context/ThemeContext";
import { UiStyles } from "./UiStyles";
import Text from "./core/Text";

export default function Title({ children, ...props }) {
    const { theme } = useTheme();
    return (
        <Text
            style={UiStyles.title}
            color={theme.colors.accent}
            preset="h3"
            oneLine
            {...props}
        >
            {children}
        </Text>
    );
}

