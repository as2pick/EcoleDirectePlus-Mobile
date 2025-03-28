import { DefaultTheme, useTheme } from "@react-navigation/native";
import { GLOBALS_DATAS } from "../constants/device/globals";

export const THEMES = {
    opulent: {
        // light
        ...DefaultTheme,
        /*
        colors: {
            ...DefaultTheme.colors,
            background: "rgb(235, 225, 255)",
            bg: {
                bg1: "rgb(220, 200, 255)",
                bg2: "rgb(210, 190, 245)",
                bg3: "rgb(200, 180, 235)",
                bg4: "rgb(190, 170, 225)",
                bg5: "rgb(180, 160, 215)",
                bg6: "rgb(170, 150, 205)",
            },
            txt: {
                txt1: "rgb(40, 20, 80)",
                txt2: "rgb(70, 50, 120)",
                txt3: "rgb(100, 80, 160)",
            },
            navbar: {
                icons: "rgb(40, 20, 80)",
                active_icon_bg: "rgb(210, 190, 245)",
                icons_bg: "rgb(220, 200, 255)",
                background: "rgb(235, 225, 255)",
                border: "rgb(200, 180, 235)",
            },
            border: "rgb(180, 160, 215)",
        },
        ...GLOBALS_DATAS,
        // /kill eyes
        */
    },
    etheral: {
        //dark
        ...DefaultTheme,

        colors: {
            ...DefaultTheme.colors,
            background: "rgb(12, 12, 23)", // default key
            bg: {
                bg1: "rgb(25, 25, 56)",
                bg2: "rgb(19, 19, 34)",
                bg3: "rgb(94, 94, 136)",
                bg4: "rgb(50, 50, 87)",
                bg5: "rgb(197, 197, 247)",
                bg6: "rgb(64, 64, 130)",
            },
            txt: {
                txt1: "rgb(255, 255, 255)",
                txt2: "rgb(109, 106, 251)",
                txt3: "rgb(180, 180, 240)",
            },
            navbar: {
                icons: "rgb(255, 255, 255)",
                active_icon_bg: "rgb(34, 34, 52)",
                icons_bg: "rgb(17, 17, 38)",
                background: "rgb(12, 12, 32)",
                border: "rgb(23, 23, 41)",
            },

            border: "rgb(92, 113, 250)",
        },
        ...GLOBALS_DATAS,
    },
};

export const getCurrentTheme = () => {
    return useTheme();
};

