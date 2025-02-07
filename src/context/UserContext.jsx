import React, { createContext, useContext, useMemo, useState } from "react";

const userContext = createContext();

export const UserProvider = ({ children }) => {
    // user data
    const [globalUserData, setGlobalUserData] = useState(null);
    const [userAccesToken, setUserAccesToken] = useState(null);

    // timetable
    const [sortedTimetableData, setSortedTimetableData] = useState(null);

    const contextValueUser = useMemo(
        () => ({
            globalUserData,
            userAccesToken,

            // timetable
            sortedTimetableData,
            setSortedTimetableData,

            //

            setGlobalUserData,
            setUserAccesToken,
        }),
        [globalUserData, userAccesToken, sortedTimetableData]
    );
    return (
        <userContext.Provider value={contextValueUser}>
            {children}
        </userContext.Provider>
    );
};

export const useUser = () => useContext(userContext);

