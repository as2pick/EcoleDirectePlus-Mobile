import { createContext, useContext, useMemo, useState } from "react";

const GlobalAppContext = createContext();

export const GlobalAppProvider = ({ children }) => {
    const [activeNetworkStatus, setActiveNetworkStatus] = useState({
        isConnected: null,
        isInternetReachable: null,
        type: "unknown",
        inAirplaneMode: null,
    });

    const contextValue = useMemo(
        () => ({
            activeNetworkStatus,
            setActiveNetworkStatus,
        }),
        [activeNetworkStatus]
    );

    return (
        <GlobalAppContext.Provider value={contextValue}>
            {children}
        </GlobalAppContext.Provider>
    );
};

export const useGlobalApp = () => {
    const context = useContext(GlobalAppContext);
    if (!context) {
        throw new Error("useGlobalApp must be used in GlobalAppProvider");
    }
    return context;
};

