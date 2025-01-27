import React, { createContext, useContext, useState } from "react";

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
    const [error, setError] = useState(null);

    const triggerError = (message, details) => {
        setError({ message, details });
    };

    const resetError = () => {
        setError(null);
    };

    return (
        <ErrorContext.Provider value={{ error, triggerError, resetError }}>
            {children}
        </ErrorContext.Provider>
    );
};

export const useError = () => useContext(ErrorContext);

