import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("screen");

export const GLOBALS_DATAS = {
    screen: {
        width,
        height,
    },
};

