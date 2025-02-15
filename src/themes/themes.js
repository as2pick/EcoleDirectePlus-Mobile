import { DefaultTheme } from "@react-navigation/native";

export const THEMES = {
    opulent: {
        // light
        ...DefaultTheme,
    },
    etheral: {
        //dark
        ...DefaultTheme,

        colors: {
            ...DefaultTheme.colors,
            navbar: {
                icons: "rgb(255, 255, 255)",
                active_icon_bg: "rgb(34, 34, 52)",
                icons_bg: "rgb(17, 17, 38)",
                background: "rgb(12, 12, 32)",
            },
            back: {
                over_padding: "rgb(19, 19, 34)",
            },
            background: "rgb(12, 12, 23)", // default key
            text: "rgb(255, 255, 255)",
        },
    },
};

