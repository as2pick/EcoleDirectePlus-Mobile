import * as React from "react";
import Svg, { Path } from "react-native-svg";

export const TimetableIcon = ({ width, height, props = {} }) => {
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 100 100"
            fill="none"
            {...props}
        >
            <Path
                d="M33.444 16v64.563M7 59.125h79.44M59.829 67.65V16M86.333 37.563H7M75.86 59.041H74.14c-8.914 0-16.14 7.227-16.14 16.141 0 8.915 7.226 16.14 16.14 16.14h1.719c8.914 0 16.14-7.225 16.14-16.14 0-8.914-7.226-16.14-16.14-16.14z"
                stroke="white"
                strokeWidth="6"
            />
            <Path
                d="M77.044 76.112V67.65a2.152 2.152 0 10-4.304 0v6.456l-3.855 3.47a2.133 2.133 0 002.805 3.213l5.243-4.437c.07-.06.11-.147.11-.239z"
                fill="white"
            />
            <Path
                d="M58.944 80.563H19c-6.627 0-12-5.373-12-12V28c0-6.627 5.373-12 12-12h55.333c6.627 0 12 5.373 12 12v35.525"
                stroke="white"
                strokeWidth="6"
            />
        </Svg>
    );
};

