import { useThemeStore } from "../../hooks/useThemeStore";
import { THEMES_ASSOCIATIONS } from "../../themes/themes";
import { UiStyles } from "./UiStyles";
import Text from "./core/Text";

export default function Title({ children, ...props }) {
    const theme = useThemeStore((state) => {
        const activeMode = state.followSystem ? state.systemTheme : state.themeMode;
        return THEMES_ASSOCIATIONS[activeMode];
    });
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

