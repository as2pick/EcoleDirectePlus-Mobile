import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import { SYSTEM_FOLLOW_KEY, THEME_KEY, THEMES_ASSOCIATIONS } from "../themes/themes";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const systemColorScheme = useColorScheme();

    const [colorScheme, setColorScheme] = useState(systemColorScheme || "light");
    const [isFollowingSystem, setIsFollowingSystem] = useState(true);

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const [savedThemeStr, followSystemStr] = await Promise.all([
                    AsyncStorage.getItem(THEME_KEY),
                    AsyncStorage.getItem(SYSTEM_FOLLOW_KEY),
                ]);
                const shouldFollowSystem =
                    followSystemStr !== null ? JSON.parse(followSystemStr) : true;

                setIsFollowingSystem(shouldFollowSystem);

                const savedTheme = savedThemeStr ? JSON.parse(savedThemeStr) : null;

                if (!savedTheme) {
                    await storeThemeInPersistentStorage(
                        systemColorScheme,
                        shouldFollowSystem
                    );
                    return;
                }

                if (shouldFollowSystem) {
                    setColorScheme(systemColorScheme || "light");
                } else if (savedTheme) {
                    setColorScheme(savedTheme);
                    setIsFollowingSystem(false);
                } else {
                    setColorScheme(systemColorScheme || "light");
                }
            } catch (e) {
                console.log("Error when load theme :", e);
                setColorScheme(systemColorScheme || "light");
                setIsFollowingSystem(true);
            }
        };
        loadTheme();
    }, []);

    useEffect(() => {
        if (isFollowingSystem && systemColorScheme) {
            setColorScheme(systemColorScheme);
        }
    }, [systemColorScheme, isFollowingSystem]);

    const toggleTheme = async () => {
        try {
            const newScheme = colorScheme === "light" ? "dark" : "light";
            setColorScheme(newScheme);
            setIsFollowingSystem(false);
            await storeThemeInPersistentStorage(newScheme);
        } catch (e) {
            console.log("Error saving theme :", e);
        }
    };

    const followSystemTheme = async () => {
        try {
            setIsFollowingSystem(true);
            setColorScheme(systemColorScheme || "light");
            await storeThemeInPersistentStorage(systemColorScheme, true);
        } catch (e) {
            console.log("Error follow system theme", e);
        }
    };

    const setManualTheme = async (theme) => {
        try {
            setColorScheme(theme);
            setIsFollowingSystem(false);
            await storeThemeInPersistentStorage(theme);
        } catch (e) {
            console.log("Error set theme manually:", e);
        }
    };

    const storeThemeInPersistentStorage = async (
        themeValue,
        followSystem = false
    ) => {
        try {
            await Promise.all([
                AsyncStorage.setItem(THEME_KEY, JSON.stringify(themeValue)),
                AsyncStorage.setItem(
                    SYSTEM_FOLLOW_KEY,
                    JSON.stringify(followSystem)
                ),
            ]);
        } catch (error) {
            console.log("Error set theme:", error);
        }
    };

    const contextValue = useMemo(
        () => ({
            colorScheme,
            theme: THEMES_ASSOCIATIONS[colorScheme],
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

