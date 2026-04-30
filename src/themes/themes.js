import { DefaultTheme as NavigationDefaultTheme } from "@react-navigation/native";

const fonts = {
    bold: { fontFamily: "Luciole-Regular", fontWeight: "600" },
    heavy: { fontFamily: "Luciole-Regular", fontWeight: "700" },
    medium: { fontFamily: "Luciole-Regular", fontWeight: "normal" },
    regular: { fontFamily: "Lexend-Regular", fontWeight: "normal" },
};

export const THEMES = {
    opulent: {
        ...NavigationDefaultTheme,
        dark: false,
        isDark: false,
        colors: {
            ...NavigationDefaultTheme.colors,
            background: "rgb(178, 193, 252)",
            backgroundGradient: ["rgb(228, 228, 255)", "rgb(176, 176, 225)"],
            bg: {
                bg1: "rgb(255, 255, 255)",
                bg2: "rgb(134, 133, 237)",
                bg3: "rgb(176, 176, 225)",
                bg4: "rgb(176, 176, 225)",
                bg5: "rgb(120, 120, 251)",
                bg6: "rgb(228, 228, 255)",
            },
            txt: {
                txt1: "rgb(72, 74, 84)",
                txt2: "rgb(109, 106, 251)",
                txt3: "rgb(67, 67, 154)",
                purple: "rgb(126, 93, 224)",
            },
            navbar: {
                icons: "rgb(255, 255, 255)",
                active_icon_bg: "rgb(126, 93, 224)",
                icons_bg: "rgb(176, 176, 225)",
                background: "rgb(228, 228, 255)",
                border: "rgb(126, 93, 224)",
            },
            border: "rgb(92, 113, 250)",
            mascot: "canardmanchill2.png",
        },
        fonts,
    },
    etheral: {
        ...NavigationDefaultTheme,
        dark: true,
        isDark: true,
        colors: {
            ...NavigationDefaultTheme.colors,
            background: "rgb(18, 18, 48)",
            backgroundGradient: ["rgb(18, 18, 48)", "rgb(43, 43, 63)"],
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
                purple: "rgb(126, 93, 224)",
            },
            navbar: {
                icons: "rgb(255, 255, 255)",
                active_icon_bg: "rgb(126, 93, 224)",
                icons_bg: "rgb(17, 17, 38)",
                background: "rgb(12, 12, 32)",
                border: "rgb(23, 23, 41)",
            },
            border: "rgb(92, 113, 250)",
            mascot: "canardmanchill2.png",
        },
        fonts,
    },
};

export const THEMES_ASSOCIATIONS = {
    light: THEMES.opulent,
    dark: THEMES.etheral,
};

export const THEME_KEY = "@user_theme";
export const SYSTEM_FOLLOW_KEY = "@follow_system_theme";
