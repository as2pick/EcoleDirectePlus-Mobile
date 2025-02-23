import React, { createContext, useContext, useMemo } from "react";

const globalAppContext = createContext();

export const GlobalAppProvider = ({ children }) => {
    // global states

    const contextValue = useMemo(() => ({}), []);

    return (
        <globalAppContext.Provider value={contextValue}>
            {children}
        </globalAppContext.Provider>
    );
};

export const useGlobalApp = () => useContext(globalAppContext);

