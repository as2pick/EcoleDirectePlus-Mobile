import { DefaultTheme as NavigationDefaultTheme } from "@react-navigation/native";

export const THEMES = {
    opulent: {
        isDark: false, // ou true si tu veux une version sombre
        ...NavigationDefaultTheme,
        colors: {
            ...NavigationDefaultTheme.colors,
            background: {
                //gradient: ["rgba(169, 169, 255, 1)", "rgba(230, 230, 255, 1)"], // App backround gradient
                gradient: ["rgba(222, 222, 250, 1)", "rgba(222, 222, 250, 1)"],
                login: "rgba(230, 230, 255, 1)", // Login screen background
            },
            bg: {
                bg1: "rgba(35, 35, 207, 1)", // 
                bg2: "rgba(255, 255, 255, 1)", // 
                bg3: "rgba(26, 26, 151, 1)", // Background Modal
                bg4: "rgba(148, 148, 255, 1)", // 
                bg5: "rgba(148, 148, 255, 1)", // Useless ?
                bg6: "rgba(35, 35, 207, 1)", // Useless ?
            },
            txt: {
                contrast: "rgba(0, 0, 0, 1)", // Contrast text
                secondary: "rgba(0, 0, 153, 1)", // Secondary color text
                primary: "rgba(35, 35, 207, 1)", // Standard text
                muted: "rgba(35, 35, 207, 0.5)", // Muted color
            },
            navbar: {
                active_icon: "rgba(126, 126, 255, 1)",
                active_icon_bg: "rgba(96, 96, 192, 1)",
                icons_bg: "rgba(126, 126, 255, 1)",
                background: "rgba(148, 148, 255, 1)",
                border: "rgba(126, 126, 255, 1)",
            },
            border: "rgba(26, 26, 151, 1)",
            icons: "rgba(0, 0, 0, 1)",
            error: "rgb(240, 90, 90)",
            fond: ["rgba(222, 222, 250, 1)", "rgba(222, 222, 250, 1)"],
            pastel: "rgb(222, 222, 250)",
            secondary: "rgb(180, 180, 253)",
            main: "rgb(119, 119, 247)",
            accent: "rgb(62, 62, 221)",
            contrast: "rgb(0, 0, 0)",
            case: "white",
        },
        fonts: {
            bold: { fontFamily: "Luciole-Regular", fontWeight: "600" },
            heavy: { fontFamily: "Luciole-Regular", fontWeight: "700" },
            medium: { fontFamily: "Luciole-Regular", fontWeight: "normal" },
            regular: { fontFamily: "Lexend-Regular", fontWeight: "normal" },
        },
    },
    etheral: {
        //dark
        isDark: true,
        ...NavigationDefaultTheme,
        colors: {
            ...NavigationDefaultTheme.colors,
            // background: "rgb(18, 18, 138)", // default key
            background: {
                gradient: ["rgb(18, 18, 48)", "rgb(43, 43, 63)"], // +20 or +30
                login: "rgb(19, 19, 34)", // Fond de l'écran de login
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
                contrast: "rgb(255, 255, 255)",
                secondary: "rgb(109, 106, 251)",
                primary: "rgb(180, 180, 240)",
                muted: "rgba(180, 180, 240, 0.5)"
            },
            navbar: {
                active_icon_bg: "rgb(34, 34, 52)",
                icons_bg: "rgb(17, 17, 38)",
                background: "rgb(12, 12, 32)",
                border: "rgb(23, 23, 41)",
            },

            border: "rgb(92, 113, 250)",
            icons: "rgb(255, 255, 255)",
            fond: "rgb(255, 255, 255)",
            pastel: "rgb(222, 222, 250)",
            secondary: "rgb(180, 180, 253)",
            main: "rgb(119, 119, 247)",
            accent: "rgb(62, 62, 221)",
            case: "black",
        },
        fonts: {
            bold: { fontFamily: "Luciole-Regular", fontWeight: "600" },
            heavy: { fontFamily: "Luciole-Regular", fontWeight: "700" },
            medium: { fontFamily: "Luciole-Regular", fontWeight: "normal" },
            regular: { fontFamily: "Lexend-Regular", fontWeight: "normal" },
        },
    },
};

export const THEMES_ASSOCIATIONS = {
    light: THEMES.opulent,
    dark: THEMES.etheral,
};
export const THEME_KEY = "@user_theme";
export const SYSTEM_FOLLOW_KEY = "@follow_system_theme";

