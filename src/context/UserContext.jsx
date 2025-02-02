import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

const userContext = createContext();

export const UserProvider = ({ children }) => {
    // user data
    const [globalUserData, setGlobalUserData] = useState(null);
    const [userAccesToken, setUserAccesToken] = useState(null);
    // const [userId, setUserId] = useState("");
    // const [activeConnectionToken, ]

    useEffect(() => {
        if (!globalUserData) return;
        // console.log("USERCONTEXT.JSX GLOBALUSERDATA", globalUserData);
    }, [globalUserData]);

    const contextValueUser = useMemo(
        () => ({
            globalUserData,
            userAccesToken,

            setGlobalUserData,
            setUserAccesToken,
        }),
        [globalUserData, userAccesToken]
    );
    return (
        <userContext.Provider value={contextValueUser}>
            {children}
        </userContext.Provider>
    );
};

export const useUser = () => useContext(userContext);

