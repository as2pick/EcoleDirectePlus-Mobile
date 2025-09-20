import Svg, { Path } from "react-native-svg";

export default function GradeArrow({ size = 30, fill = "white", props = {} }) {
    return (
        <Svg width={23} height={40} viewBox="0 0 23 40" fill={"none"}>
            <Path
                d="M7.3275 2.28707L21.241 18.012C22.2453 19.1471 22.2453 20.8529 21.241 21.988L7.3275 37.7129C6.60332 38.5314 5.56295 39 4.47013 39C1.18224 39 -0.565973 35.1189 1.61276 32.6565L11.0524 21.988C12.0567 20.8529 12.0567 19.1471 11.0524 18.012L1.61276 7.34349C-0.56597 4.88111 1.18224 1 4.47012 1C5.56295 1 6.60332 1.46862 7.3275 2.28707Z"
                stroke={fill}
                strokeWidth="1.2"
                strokeOpacity={"0.5"}
            />
        </Svg>
    );
}

