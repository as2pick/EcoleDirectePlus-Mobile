import React, { createContext, useContext, useMemo, useState } from "react";

const globalAppContext = createContext();

export const GlobalAppProvider = ({ children }) => {
    // global states
    const [isConnected, setIsConnected] = useState(false);
    const contextValue = useMemo(
        () => ({
            isConnected,
            setIsConnected,
        }),
        [isConnected]
    );

    return (
        <globalAppContext.Provider value={contextValue}>
            {children}
        </globalAppContext.Provider>
    );
};

export const useGlobalApp = () => useContext(globalAppContext);

