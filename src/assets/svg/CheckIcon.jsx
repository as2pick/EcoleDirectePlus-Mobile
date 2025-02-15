import Svg, { LinearGradient, Path, Stop } from "react-native-svg";

export default function CheckIcon({ size = 30, props = {} }) {
    return (
        <Svg
            viewBox="0 0 91 86"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            width={size}
            height={size}
            {...props}
        >
            <Path
                fill="url(#gradient)"
                d="M89.9985 24V0H31.9985C21.3319 0.833333 0 7.3 0 38.5C5.50049 26.5 17.499 24 21.4985 24H89.9985Z"
            />
            <Path
                fill="url(#gradient)"
                d="M90.0017 55V31.5H27.0016C-9.00047 31.5 -9.00055 86 27.0016 86H90.0017V62.5H27.0016C22.0011 62.5 22.0013 55 27.0016 55H90.0017Z"
            />
            <LinearGradient id="gradient">
                <Stop className="start" offset="0%" stopColor="#B4C9FF" />
                <Stop className="end" offset="100%" stopColor="#C1B7FF" />
            </LinearGradient>
        </Svg>
    );
}

