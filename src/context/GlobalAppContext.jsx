import React, { createContext, useContext, useMemo, useState } from "react";

const globalAppContext = createContext();

export const GlobalAppProvider = ({ children }) => {
    // global states
    const [value, setValue] = useState("Hello World !");
    const contextValue = useMemo(
        () => ({
            value,
            setValue,
        }),
        [value]
    );

    return (
        <globalAppContext.Provider value={contextValue}>
            {children}
        </globalAppContext.Provider>
    );
};

export const useGlobalApp = () => useContext(globalAppContext);

