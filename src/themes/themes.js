import { DefaultTheme as NavigationDefaultTheme } from "@react-navigation/native";

export const THEMES = {
    opulent: {
        // light
        ...NavigationDefaultTheme,
        /*
        colors: {
            ...DefaultTheme.colors,
           background: "rgb(255, 255, 255)",
            bg: {
                bg1: "rgb(168, 156, 255)",
                bg2: "rgb(157, 153, 244)",
                bg3: "rgb(113, 115, 241)",
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
                active_icon_bg: "rgb(151, 121, 202)",
                icons_bg: "rgb(184, 184, 249)",
                background: "rgb(184, 184, 249)",
                border: "rgb(0, 0, 0)",
            },
            border: "rgb(180, 160, 215)",
        },
        fonts: {
            bold: { fontFamily: "Luciole-Regular", fontWeight: "600" },
            heavy: { fontFamily: "Luciole-Regular", fontWeight: "700" },
            medium: { fontFamily: "Luciole-Regular", fontWeight: "normal" },
            regular: { fontFamily: "Lexend-Regular", fontWeight: "normal" },
        },
        ...GLOBALS_DATAS,
        // /kill eyes
        */
    },
    etheral: {
        //dark
        ...NavigationDefaultTheme,
        colors: {
            ...NavigationDefaultTheme.colors,
            // background: "rgb(18, 18, 138)", // default key
            background: {
                gradient: ["rgb(18, 18, 48)", "rgb(43, 43, 63)"], // +20 or +30
            },
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
        fonts: {
            bold: { fontFamily: "Luciole-Regular", fontWeight: "600" },
            heavy: { fontFamily: "Luciole-Regular", fontWeight: "700" },
            medium: { fontFamily: "Luciole-Regular", fontWeight: "normal" },
            regular: { fontFamily: "Lexend-Regular", fontWeight: "normal" },
        },
    },
};

