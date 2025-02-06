import React, { createContext, useContext, useMemo, useState } from "react";

const appSettingsContext = createContext();

export const AppSettingsProvider = ({ children }) => {
    // app config
    const [theme, setTheme] = useState(0);

    const contextValueAppSettings = useMemo(
        () => ({
            theme,
            setTheme,
        }),
        [theme]
    );

    return (
        <appSettingsContext.Provider value={contextValueAppSettings}>
            {children}
        </appSettingsContext.Provider>
    );
};

export const useAppSettings = () => useContext(appSettingsContext);

