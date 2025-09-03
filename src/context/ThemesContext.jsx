import { createContext, useContext, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import { THEMES } from "../themes/themes";

const ThemesContext = createContext();

export const ThemesProvider = ({ children }) => {
    const systemColorScheme = useColorScheme() || "light"; // fallback
    const [theme, setTheme] = useState(systemColorScheme);

    const themesOrganisation = {
        light: THEMES.opulent,
        dark: THEMES.etheral,
    };

    const toggleTheme = () =>
        setTheme((prev) => (prev === "light" ? "dark" : "light"));

    const themeLoader = useMemo(() => themesOrganisation[theme], [theme]);

    const contextValue = useMemo(
        () => ({ theme, toggleTheme, themeLoader }),
        [theme, toggleTheme, themeLoader]
    );

    return (
        <ThemesContext.Provider value={contextValue}>
            {children}
        </ThemesContext.Provider>
    );
};

export const useThemes = () => useContext(ThemesContext);

