import { useTheme } from "../../context/ThemeContext";
import { UiStyles } from "./UiStyles";
import Text from "./core/Text";

export default function Subtitle({ children, ...props }) {
    const { theme } = useTheme();

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

