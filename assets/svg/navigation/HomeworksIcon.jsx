import Svg, { Path, Rect } from "react-native-svg";

export default function HomeworksIcon({ width, height, props = {} }) {
    return (
        <Svg width={width} height={height} viewBox="0 0 100 100" {...props}>
            <Path
                d="M73 87.5C64.4396 87.5 57.5 80.5604 57.5 72C57.5 63.4396 64.4396 56.5 73 56.5C81.5604 56.5 88.4999 63.4396 88.4999 72C88.4999 80.5604 81.5604 87.5 73 87.5Z"
                stroke="white"
                strokeWidth="6"
                fill="none"
            />
            <Path
                d="M69 73V66C69 64.8954 69.8954 64 71 64C72.1046 64 73 64.8954 73 66V72H78C79.1046 72 80 72.8954 80 74C80 75.1046 79.1046 76 78 76H72C70.3431 76 69 74.6569 69 73Z"
                fill="white"
            />
            <Path
                d="M24 93H51C52.6569 93 54 91.6569 54 90C54 88.3431 52.6569 87 51 87H26C21.5817 87 18 83.4183 18 79V21C18 16.5817 21.5817 13 26 13H68C72.4183 13 76 16.5817 76 21V44C76 45.6569 77.3431 47 79 47C80.6569 47 82 45.6569 82 44V19C82 12.3726 76.6274 7 70 7H24C17.3726 7 12 12.3726 12 19V81C12 87.6274 17.3726 93 24 93Z"
                fill="white"
            />
            <Rect
                x="30"
                y="67"
                width="18"
                height="6"
                rx="3"
                class="fill-text-main"
                fill="white"
            />
            <Rect
                x="8"
                y="67"
                width="14"
                height="6"
                rx="3"
                class="fill-text-main"
                fill="white"
            />
            <Rect
                x="8"
                y="47"
                width="14"
                height="6"
                rx="3"
                class="fill-text-main"
                fill="white"
            />
            <Rect
                x="8"
                y="27"
                width="14"
                height="6"
                rx="3"
                class="fill-text-main"
                fill="white"
            />
            <Rect
                x="30"
                y="47"
                width="26"
                height="6"
                rx="3"
                class="fill-text-main"
                fill="white"
            />
            <Rect
                x="30"
                y="27"
                width="38"
                height="6"
                rx="3"
                class="fill-text-main"
                fill="white"
            />
        </Svg>
    );
}

