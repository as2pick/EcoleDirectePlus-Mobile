import { createContext, useContext, useMemo } from "react";

const GlobalAppContext = createContext();

export const GlobalAppProvider = ({ children }) => {
    // global states

    const contextValue = useMemo(() => ({}), []);

    return (
        <GlobalAppContext.Provider value={contextValue}>
            {children}
        </GlobalAppContext.Provider>
    );
};

export const useGlobalApp = () => useContext(GlobalAppContext);

