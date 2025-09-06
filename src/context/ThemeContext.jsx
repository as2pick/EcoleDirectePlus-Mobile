import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import { THEMES } from "../themes/themes";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [colorScheme, setColorScheme] = useState(systemColorScheme || "light");
    const [isFollowingSystem, setIsFollowingSystem] = useState(true);

    const STORAGE_KEY = "@user_theme";
    const SYSTEM_FOLLOW_KEY = "@follow_system_theme";

    // Charger les préférences stockées
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const [savedTheme, followSystem] = await Promise.all([
                    AsyncStorage.getItem(STORAGE_KEY),
                    AsyncStorage.getItem(SYSTEM_FOLLOW_KEY),
                ]);

                const shouldFollowSystem =
                    followSystem !== null ? JSON.parse(followSystem) : true;
                setIsFollowingSystem(shouldFollowSystem);

                if (shouldFollowSystem) {
                    setColorScheme(systemColorScheme || "light");
                } else if (savedTheme) {
                    setColorScheme(savedTheme);
                } else {
                    setColorScheme(systemColorScheme || "light");
                }
            } catch (e) {
                console.log("Erreur chargement thème :", e);
                setColorScheme(systemColorScheme || "light");
                setIsFollowingSystem(true);
            }
        };
        loadTheme();
    }, []);

    // Suivre les changements du thème système si activé
    useEffect(() => {
        if (isFollowingSystem && systemColorScheme) {
            setColorScheme(systemColorScheme);
        }
    }, [systemColorScheme, isFollowingSystem]);

    const themesOrganisation = {
        light: THEMES.opulent,
        dark: THEMES.etheral,
    };

    const toggleTheme = async () => {
        try {
            const newScheme = colorScheme === "light" ? "dark" : "light";
            setColorScheme(newScheme);
            setIsFollowingSystem(false);

            await Promise.all([
                AsyncStorage.setItem(STORAGE_KEY, newScheme),
                AsyncStorage.setItem(SYSTEM_FOLLOW_KEY, JSON.stringify(false)),
            ]);
        } catch (e) {
            console.log("Erreur sauvegarde thème :", e);
        }
    };

    const followSystemTheme = async () => {
        try {
            setIsFollowingSystem(true);
            setColorScheme(systemColorScheme || "light");

            await AsyncStorage.setItem(SYSTEM_FOLLOW_KEY, JSON.stringify(true));
        } catch (e) {
            console.log("Erreur activation suivi système :", e);
        }
    };

    const setManualTheme = async (theme) => {
        try {
            setColorScheme(theme);
            setIsFollowingSystem(false);

            await Promise.all([
                AsyncStorage.setItem(STORAGE_KEY, theme),
                AsyncStorage.setItem(SYSTEM_FOLLOW_KEY, JSON.stringify(false)),
            ]);
        } catch (e) {
            console.log("Erreur définition thème manuel :", e);
        }
    };

    const contextValue = useMemo(
        () => ({
            colorScheme,
            theme: themesOrganisation[colorScheme],
            isFollowingSystem,
            toggleTheme,
            followSystemTheme,
            setManualTheme,
            systemColorScheme,
        }),
        [colorScheme, isFollowingSystem, systemColorScheme]
    );

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
