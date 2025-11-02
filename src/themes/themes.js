import { DefaultTheme as NavigationDefaultTheme } from "@react-navigation/native";

export const THEMES = {
    opulent: {
        isDark: false, // ou true si tu veux une version sombre
        ...NavigationDefaultTheme,
        colors: {
            ...NavigationDefaultTheme.colors,
            background: {
                gradient: ["rgba(169, 169, 255, 1)", "rgba(227, 227, 255, 1)"], // Rouge profond en dégradé
                login: "rgba(255, 255, 255, 1)"
            },
            bg: {
                bg1: "rgba(35, 35, 207, 1)", // Rouge vif
                bg2: "rgba(255, 255, 255, 1)", // Rouge foncé
                bg3: "rgba(26, 26, 151, 1)", // Rouge clair
                bg4: "rgba(148, 148, 255, 1)", // Rouge sombre
                bg5: "rgba(148, 148, 255, 1)", // Rose pâle
                bg6: "rgba(35, 35, 207, 1)", // Rouge très foncé
            },
            txt: {
                txt1: "rgb(0, 0, 0)", // Blanc pour contraste
                txt2: "rgba(26, 26, 151, 1)", // Rose clair
                txt3: "rgba(35, 35, 207, 1)", // Rose moyen
            },
            navbar: {
                icons: "rgba(0, 0, 0, 1)", // Icônes blanches
                active_icon: "rgba(126, 126, 255, 1)",
                active_icon_bg: "rgba(96, 96, 192, 1)", // Rouge actif
                icons_bg: "rgba(126, 126, 255, 1)", // Rouge foncé pour fond d'icônes
                background: "rgba(148, 148, 255, 1)", // Rouge très foncé pour la navbar
                border: "rgba(126, 126, 255, 1)", // Rouge pour bordure
            },
            border: "rgba(26, 26, 151, 1)", // Rouge clair pour les bordures générales
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
                login: "rgb(19, 19, 34)"
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

export const THEMES_ASSOCIATIONS = {
    light: THEMES.opulent,
    dark: THEMES.etheral,
};
export const THEME_KEY = "@user_theme";
export const SYSTEM_FOLLOW_KEY = "@follow_system_theme";

