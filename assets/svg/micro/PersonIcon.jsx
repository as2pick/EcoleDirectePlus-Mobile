import Svg, { Path, Rect } from "react-native-svg";
import { useTheme } from "../../../src/context/ThemeContext";

export default function PersonIcon({ size = 30, fill, props = {} }) {
    const { theme } = useTheme();
    fill = fill || theme.colors.theme
    return (
        <Svg fill={fill} width={size} height={size} viewBox="0 0 24 24">
            <Rect width="24" height="24" opacity="0" />

            <Path d="M12 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0-6a2 2 0 1 1-2 2 2 2 0 0 1 2-2z" />

            <Path d="M12 13a7 7 0 0 0-7 7 1 1 0 0 0 2 0 5 5 0 0 1 10 0 1 1 0 0 0 2 0 7 7 0 0 0-7-7z" />
        </Svg>
    );
}

