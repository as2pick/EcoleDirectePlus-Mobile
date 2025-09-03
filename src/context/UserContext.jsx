import { createContext, useContext, useMemo, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    // user data
    const [globalUserData, setGlobalUserData] = useState(null);
    const [userAccesToken, setUserAccesToken] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    // timetable
    const [sortedTimetableData, setSortedTimetableData] = useState(null);
    // grades
    const [sortedGradesData, setSortedGradesData] = useState(null);
    // homeworks
    const [sortedHomeworksData, setSortedHomeworksData] = useState(null);
    const contextValueUser = useMemo(
        () => ({
            globalUserData,
            userAccesToken,
            isConnected,

            // timetable
            sortedTimetableData,
            setSortedTimetableData,

            // grades
            sortedGradesData,
            setSortedGradesData,

            // homeworks
            sortedHomeworksData,
            setSortedHomeworksData,

            //

            setGlobalUserData,
            setUserAccesToken,
            setIsConnected,
        }),
        [
            globalUserData,
            userAccesToken,
            sortedTimetableData,
            isConnected,
            sortedGradesData,
            sortedHomeworksData,
        ]
    );
    return (
        <UserContext.Provider value={contextValueUser}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);

