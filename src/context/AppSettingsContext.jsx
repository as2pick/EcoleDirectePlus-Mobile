import React, { createContext, useContext, useMemo, useReducer } from "react";

const appSettingsContext = createContext();

export const AppSettingsProvider = ({ children }) => {
    // app config

    const defaultSettings = {};
    const appSettings = (state, action) => {
        switch (action.type) {
            case "TOGGLE_THEME":
                return "toggeled theme";
            default:
                return state;
        }
    };
    const [state, dispatch] = useReducer(appSettings, defaultSettings);
    const contextValueAppSettings = useMemo(
        () => ({ state, dispatch }),
        [state, dispatch]
    );

    return (
        <appSettingsContext.Provider value={contextValueAppSettings}>
            {children}
        </appSettingsContext.Provider>
    );
};

export const useAppSettings = () => useContext(appSettingsContext);

