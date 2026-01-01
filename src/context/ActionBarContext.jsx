import React, { createContext, useContext, useState, useCallback } from "react";

const ActionBarContext = createContext();

export const ActionBarProvider = ({ children }) => {
    const [actions, setActions] = useState([]);

    const updateActions = useCallback((newActions) => {
        setActions(newActions || []);
    }, []);

    return (
        <ActionBarContext.Provider value={{ actions, updateActions }}>
            {children}
        </ActionBarContext.Provider>
    );
};

export const useActionBar = () => {
    const context = useContext(ActionBarContext);
    if (!context) {
        throw new Error("useActionBar must be used within an ActionBarProvider");
    }
    return context;
};
