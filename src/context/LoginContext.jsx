import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

const loginContext = createContext();

export const LoginProvider = ({ children }) => {
    // app config
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [cnCv, setCnCv] = useState("");
    const [loginPayload, setLoginPayload] = useState("");
    // local

    useEffect(() => {
        if (!loginPayload) return; // skip init detection
        console.log("LOGINCONTEXT.JSX LOGINPAYLOAD", loginPayload);
    }, [loginPayload]);
    useEffect(() => {
        if (!cnCv) return;
        console.log("LOGINCONTEXT.JSX CNCV", cnCv);
    }, [cnCv]);

    const contextValueLogin = useMemo(
        () => ({
            username,
            password,
            cnCv,
            loginPayload,
            isConnected,
            setUsername,
            setPassword,
            setCnCv,
            setLoginPayload,
            setIsConnected,
        }),
        [username, password, cnCv, isConnected]
    );

    return (
        <loginContext.Provider value={contextValueLogin}>
            {children}
        </loginContext.Provider>
    );
};

export const useLogin = () => useContext(loginContext);

