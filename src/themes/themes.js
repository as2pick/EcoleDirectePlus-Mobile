import { DefaultTheme as NavigationDefaultTheme } from "@react-navigation/native";

export const THEMES = {
    opulent: {
        isDark: false, // ou true si tu veux une version sombre
        ...NavigationDefaultTheme,
        colors: {
            ...NavigationDefaultTheme.colors,
            background: {
                //gradient: ["rgba(169, 169, 255, 1)", "rgba(230, 230, 255, 1)"], // App backround gradient
                //gradient: "rgba(240, 240, 240, 1)",
                gradient: ["#A9A9FF", "#E6E6FF"],
                login: "rgba(230, 230, 255, 1)", // Login screen background
                modal: "rgb(240, 240, 253)",
            },
            bg: {
                bg1: "rgba(35, 35, 207, 1)", // DON'T USE IT
                bg2: "rgba(255, 255, 255, 1)", // DON'T USE IT
                bg3: "rgba(26, 26, 151, 1)", // DON'T USE IT
                bg4: "rgba(148, 148, 255, 1)", // DON'T USE IT
                bg5: "rgba(148, 148, 255, 1)", // DON'T USE IT
                bg6: "rgba(35, 35, 207, 1)", // DON'T USE IT
            },
            txt: {
                txt1: "rgb(0, 0, 0)", // DON'T USE IT
                txt2: "rgba(43, 43, 43, 0.8)", // DON'T USE IT
                txt3: "rgba(35, 35, 207, 1)", // DON'T USE IT
            },
            navbar: {
                active_icon: "rgba(126, 126, 255, 1)", // DON'T USE IT
                active_icon_bg: "rgba(96, 96, 192, 1)", // DON'T USE IT
                icons_bg: "rgba(126, 126, 255, 1)", // DON'T USE IT
                background: "rgba(148, 148, 255, 1)", // DON'T USE IT
                border: "rgba(126, 126, 255, 1)", // DON'T USE IT
            },
            border: "rgba(26, 26, 151, 1)", // DON'T USE IT
            error: "rgb(240, 90, 90)",
            txt1: "rgb(65, 67, 76)",
            fond: ["rgba(150, 150, 172, 1)", "rgba(222, 222, 250, 1)"], // DON'T USE IT
            pastel: "rgba(200, 200, 252, 1)",
            secondary: "rgba(255, 255, 255, 1)",
            main: "rgba(93, 93, 255, 1)",
            main2: "rgba(123, 123, 226, 1)",
            accent: "rgb(62, 62, 221)",
            contrast: "rgb(0, 0, 0)",
            oppose: "rgba(42, 42, 49, 1)",
            case: "rgb(255, 255, 255)",
            theme: "rgb(255, 255, 255)",
            navbar: "rgb(255, 255, 255)",
            canardman: "#6F7EB8",
            edplogo: {
                c1: "rgb(102, 145, 252)",
                c2: "rgb(133, 114, 255)",
            },
            navbartempo: {
                case: "rgb(255, 255, 255)",
                main: "rgb(119, 119, 247)",
                secondary: "rgb(180, 180, 253)",
            }
        },
        fonts: {
            bold: { fontFamily: "Luciole-Regular", fontWeight: "600" },
            heavy: { fontFamily: "Luciole-Regular", fontWeight: "700" },
            medium: { fontFamily: "Luciole-Regular", fontWeight: "normal" },
            regular: { fontFamily: "Lexend-Regular", fontWeight: "normal" },
        },
        shadow: {
            oppacity: 0.14,
            color: "rgb(0, 0, 0)",
            caseSize: 5,
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
                //gradient: "rgba(38, 39, 46, 1)", //"rgba(33, 33, 34, 1)", //"rgb(27, 27, 33)", // +20 or +30
                gradient: ["#172661ff", "#0E0F1A"],
                login: "rgb(19, 19, 34)",
                modal: "rgb(18, 18, 37)",
            },
            bg: {
                bg1: "rgb(25, 25, 56)", // DON'T USE IT
                bg2: "rgb(19, 19, 34)", // DON'T USE IT
                bg3: "rgb(94, 94, 136)", // DON'T USE IT
                bg4: "rgb(50, 50, 87)", // DON'T USE IT
                bg5: "rgb(197, 197, 247)", // DON'T USE IT
                bg6: "rgb(64, 64, 130)", // DON'T USE IT
            },
            navbar: {
                active_icon_bg: "rgb(34, 34, 52)", // DON'T USE IT
                icons_bg: "rgb(17, 17, 38)", // DON'T USE IT
                background: "rgb(12, 12, 32)", // DON'T USE IT
                border: "rgb(23, 23, 41)", // DON'T USE IT
            },

            border: "rgb(92, 113, 250)", // DON'T USE IT
            error: "rgb(240, 90, 90)",
            secondary: "rgb(28, 30, 50)", //A CHANGER
            main: "rgba(99, 130, 255, .8)",
            main2: "rgba(68, 68, 141, 1)",
            accent: "rgba(156, 156, 209, 1)", //A SUPPRIMER POUR JUSTE MAIN
            case: "rgb(72, 72, 102)", // DON'T USE IT A SUPPRIMER
            oppose: "rgba(255, 255, 255, 1)", //A SUPPRIMER
            contrast: "rgb(255, 255, 255)", //A PASSER EN TEXTE
            navbar: "rgba(63, 63, 73, 1)", //A SUPPRIMER
            theme: "rgba(0, 0, 0, 1)", //A VOIR
            canardman: "#444C6A",

            txt: {
                txt1: "rgb(255, 255, 255)", //A CHANGER
                txt2: "rgba(184, 184, 184, 0.8)", //A CHANGER
                txt3: "rgb(180, 180, 240)", //A CHANGER
            },
            txt1: "rgb(255, 255, 255)", //A CHANGER
            edplogo: {
                c1: "rgb(180, 201, 255)",//A CLARIFIER (+ de saturation ???)
                c2: "rgb(193, 183, 255)",// A CLARIFIER (+ de saturation ???)
            },
            navbartempo: {
                case: "rgb(94, 94, 136)",
                main: "rgba(166, 166, 240, 1)",
                secondary: "rgb(109, 106, 251)",
            }
        },
        fonts: {
            bold: { fontFamily: "Luciole-Regular", fontWeight: "600" },
            heavy: { fontFamily: "Luciole-Regular", fontWeight: "700" },
            medium: { fontFamily: "Luciole-Regular", fontWeight: "normal" },
            regular: { fontFamily: "Lexend-Regular", fontWeight: "normal" },
        },
        shadow: {
            oppacity: 0.4,
            color: "rgb(255, 255, 255)",
            caseSize: 8,
        },
    },
};

export const THEMES_ASSOCIATIONS = {
    light: THEMES.opulent,
    dark: THEMES.etheral,
};
export const THEME_KEY = "@user_theme";
export const SYSTEM_FOLLOW_KEY = "@follow_system_theme";

