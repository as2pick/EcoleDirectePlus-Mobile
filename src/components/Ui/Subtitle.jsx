import { useThemeStore } from "../../hooks/useThemeStore";
import { THEMES_ASSOCIATIONS } from "../../themes/themes";
import { UiStyles } from "./UiStyles";
import Text from "./core/Text";

export default function Subtitle({ children, ...props }) {
    const theme = useThemeStore((state) => {
        const activeMode = state.followSystem ? state.systemTheme : state.themeMode;
        return THEMES_ASSOCIATIONS[activeMode];
    });

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

