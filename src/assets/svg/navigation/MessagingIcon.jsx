import Svg from "react-native-svg";

export const MessagingIcon = ({ width, height, props = {} }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 100 100" {...props}>
            <Path
                d="M87.1429 23H12C8.68629 23 6 25.6863 6 29V72C6 75.3137 8.68629 78 12 78H87.1429C90.4566 78 93.1429 75.3137 93.1429 72V29C93.1429 25.6863 90.4566 23 87.1429 23Z"
                fill="none"
                stroke="white"
                stroke-width="6"
            />
            <Path
                d="M7.84375 24.3633L45.6295 57.41C47.8879 59.3851 51.2581 59.3885 53.5204 57.4178L91.4674 24.3633"
                fill="none"
                stroke="white"
                stroke-width="6"
            />
            <Path
                d="M90.6293 76.595L64.5713 48.7144"
                fill="none"
                stroke="white"
                stroke-width="6"
            />
            <Path
                d="M7.17236 77.6544L34.5712 48.7144"
                fill="none"
                stroke="white"
                stroke-width="6"
            />
        </Svg>
    );
};

