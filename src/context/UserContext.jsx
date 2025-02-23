import React, { createContext, useContext, useMemo, useState } from "react";

const userContext = createContext();

export const UserProvider = ({ children }) => {
    // user data
    const [globalUserData, setGlobalUserData] = useState(null);
    const [userAccesToken, setUserAccesToken] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    // timetable
    const [sortedTimetableData, setSortedTimetableData] = useState(null);

    const contextValueUser = useMemo(
        () => ({
            globalUserData,
            userAccesToken,
            isConnected,

            // timetable
            sortedTimetableData,
            setSortedTimetableData,

            //

            setGlobalUserData,
            setUserAccesToken,
            setIsConnected,
        }),
        [globalUserData, userAccesToken, sortedTimetableData, isConnected]
    );
    return (
        <userContext.Provider value={contextValueUser}>
            {children}
        </userContext.Provider>
    );
};

export const useUser = () => useContext(userContext);

