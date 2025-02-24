import { Dimensions } from "react-native";
import { CONFIG } from "../config";

let { width, height } = Dimensions.get("screen");

height -= CONFIG.tabBarHeight;

export const GLOBALS_DATAS = {
    screen: {
        width,
        height,
    },
};

