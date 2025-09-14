import { DefaultTheme as NavigationDefaultTheme } from "@react-navigation/native";

export const THEMES = {
    opulent: {
        isDark: false, // ou true si tu veux une version sombre
        ...NavigationDefaultTheme,
        colors: {
            ...NavigationDefaultTheme.colors,
            background: {
                gradient: ["rgb(80, 0, 0)", "rgb(120, 0, 0)"], // Rouge profond en dégradé
            },
            bg: {
                bg1: "rgb(180, 30, 30)", // Rouge vif
                bg2: "rgb(150, 20, 20)", // Rouge foncé
                bg3: "rgb(200, 50, 50)", // Rouge clair
                bg4: "rgb(120, 0, 0)", // Rouge sombre
                bg5: "rgb(255, 180, 180)", // Rose pâle
                bg6: "rgb(100, 0, 0)", // Rouge très foncé
            },
            txt: {
                txt1: "rgb(255, 255, 255)", // Blanc pour contraste
                txt2: "rgb(255, 200, 200)", // Rose clair
                txt3: "rgb(255, 150, 150)", // Rose moyen
            },
            navbar: {
                icons: "rgb(255, 255, 255)", // Icônes blanches
                active_icon_bg: "rgb(120, 0, 0)", // Rouge actif
                icons_bg: "rgb(80, 0, 0)", // Rouge foncé pour fond d'icônes
                background: "rgb(60, 0, 0)", // Rouge très foncé pour la navbar
                border: "rgb(150, 0, 0)", // Rouge pour bordure
            },
            border: "rgb(200, 50, 50)", // Rouge clair pour les bordures générales
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

