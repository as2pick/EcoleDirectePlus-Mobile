import Svg, { Path } from "react-native-svg";
import { useTheme } from "@react-navigation/native";

export default function BackArrow({ size = 30, fill, props = {} }) {
    const { colors } = useTheme();
    fill = fill || colors.contrast
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill={"none"}>
            <Path
                d="M4 12H20M4 12L8 8M4 12L8 16"
                stroke={fill}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

