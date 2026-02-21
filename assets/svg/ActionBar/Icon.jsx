import Svg, { Circle } from "react-native-svg";
import { useTheme } from "../../../src/context/ThemeContext";

export default function MenuDotsIcon({ width, height, fill, props = {} }) {
    const { theme } = useTheme();
    const color = fill || theme.colors.oppose;

    return (
        <Svg width={width} height={height} viewBox="0 0 100 100" {...props}>
            <Circle cx="20" cy="50" r="8" fill={color} />
            <Circle cx="50" cy="50" r="8" fill={color} />
            <Circle cx="80" cy="50" r="8" fill={color} />
        </Svg>
    );
}