import { createContext, useContext, useEffect, useMemo } from "react";
import { useColorScheme } from "react-native";
import { THEMES_ASSOCIATIONS } from "../themes/themes";
import { useThemeStore } from "../hooks/useThemeStore";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const systemColorScheme = useColorScheme();

    const themeMode = useThemeStore((state) => state.themeMode);
    const followSystem = useThemeStore((state) => state.followSystem);

    const setThemeMode = useThemeStore((state) => state.setThemeMode);
    const setFollowSystem = useThemeStore((state) => state.setFollowSystem);
    const setSystemTheme = useThemeStore((state) => state.setSystemTheme);

    useEffect(() => {
        if (systemColorScheme) {
            setSystemTheme(systemColorScheme);
        }
    }, [systemColorScheme]);

    const colorScheme = followSystem ? (systemColorScheme || 'light') : themeMode;

    const toggleTheme = () => {
        const newMode = colorScheme === 'light' ? 'dark' : 'light';
        setThemeMode(newMode);
    };

    const followSystemTheme = () => {
        setFollowSystem(true);
    };

    const setManualTheme = (theme) => {
        setThemeMode(theme);
    };

    const contextValue = useMemo(
        () => ({
            colorScheme,
            theme: THEMES_ASSOCIATIONS[colorScheme],
            isFollowingSystem: followSystem,
            toggleTheme,
            followSystemTheme,
            setManualTheme,
            systemColorScheme,
        }),
        [colorScheme, followSystem, systemColorScheme]
    );

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
