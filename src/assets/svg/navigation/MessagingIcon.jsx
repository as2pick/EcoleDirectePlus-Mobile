import Svg, { Path } from "react-native-svg";

export const MessagingIcon = ({ width, height, props = {} }) => {
    return (
        <Svg viewBox="0 0 100 100" width={width} height={height} {...props}>
            <Path
                d="M87.143 23H12a6 6 0 00-6 6v43a6 6 0 006 6h75.143a6 6 0 006-6V29a6 6 0 00-6-6z"
                fill="none"
                stroke="white"
                strokeWidth="6"
            />
            <Path
                d="M7.844 24.363L45.629 57.41a6 6 0 007.891.008l37.947-33.055M90.63 76.595L64.57 48.715M7.172 77.654l27.4-28.94"
                fill="none"
                stroke="white"
                strokeWidth="6"
            />
        </Svg>
    );
};

