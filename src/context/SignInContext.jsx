import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useReducer,
    useState,
} from "react";
import { getApiMessage } from "../constants/api/codes";

import authService from "../services/login/authService";
import { useUser } from "./UserContext";
const signInContext = createContext();

export const SignInProvider = ({ children }) => {
    // app config

    const { setGlobalUserData } = useUser();

    const authReducer = (state, action) => {
        switch (action.type) {
            case "RESTORE_TOKEN":
                return {
                    ...state,
                    userToken: action.token,
                    isLoading: false,
                };

            case "SIGN_IN":
                return {
                    ...state,
                    isSignOut: false,
                    userToken: action.token,
                };
            case "SIGN_OUT":
                return {
                    ...state,
                    isSignOut: true,
                    userToken: null,
                };
        }
    };

    const defaultLoginDatas = {
        identifiant: null,
        motdepasse: null,
        fa: null,
        userId: null,
    };
    const defaultA2fInfos = {
        a2fToken: null,
        identifiant: null,
        motdepasse: null,
        fa: null,
        userId: null,
    };

    const [mcqDatas, setMcqDatas] = useState("");
    const [a2fInfos, setA2fInfos] = useState(defaultA2fInfos);
    const [choice, setChoice] = useState("");
    const [loginDatas, setLoginDatas] = useState(defaultLoginDatas);

    const [state, dispatch] = useReducer(authReducer, {
        isLoading: true,
        isSignOut: false,
        userToken: null,
    });

    const bootstrapAsync = async () => {
        try {
            const credentials = await authService.restoreCredentials();

            if (credentials) {
                const getConnectionDatas = JSON.parse(credentials.password);

                const accountData = await authService.login({
                    authConnectionDatas: getConnectionDatas,
                });

                dispatch({ type: "RESTORE_TOKEN", token: accountData.token });
                setGlobalUserData(accountData.data.accounts[0]);

                console.log("Token restored !");
            } else {
                console.log("Login required !");
            }
        } catch (error) {
            console.error("ERROR IN BOOTSTRAP ASYNC", error);
            dispatch({ type: "SIGN_OUT" });
        }
    };

    const handleLogin = async ({ username, password }) => {
        const apiLoginData = await authService.login({
            username: username,
            password: password,
        });
        setA2fInfos((prevState) => ({
            ...prevState,
            identifiant: encodeURIComponent(username),
            motdepasse: encodeURIComponent(password),
        }));

        const { token } = apiLoginData;
        switch (apiLoginData.code) {
            case 200:
                const { data } = apiLoginData;
                const account = data.accounts[0];
                await authService.saveCredentials(token, account.id, {
                    identifiant: encodeURIComponent(username),
                    motdepasse: encodeURIComponent(password),
                });
                dispatch({ type: "SIGN_IN", token: token });
                setGlobalUserData(account);
                break;
            case 250:
                const getChoices = await authService.startA2fProcess(token);
                setMcqDatas({
                    choices: getChoices.choices,
                    question: getChoices.question,
                });
                setA2fInfos((prevState) => ({
                    ...prevState,
                    a2fToken: token,
                }));
                break;
            default:
                const message = getApiMessage(apiLoginData.code);

                if (message) {
                    console.log(message);
                } else
                    console.log({
                        error: "Bad error",
                    });
                setA2fInfos("");
        }
    };

    const handleSignOut = async () => {
        await authService.deleteCredentials();
        dispatch({ type: "SIGN_OUT" });
        setGlobalUserData(null);
    };
    useEffect(() => {
        // Fetch the token from storage then navigate to our appropriate place
        console.log("LOADED");
        bootstrapAsync();
    }, []);

    const handleA2fSubmit = async (choice) => {
        const fa = await authService.submitFormA2f(a2fInfos.a2fToken, choice);
        setA2fInfos((prevState) => ({
            ...prevState,
            fa: [{ ...fa.data }],
        }));
        setChoice("");
    };

    useEffect(() => {
        if (!choice) return;
        handleA2fSubmit(choice);
    }, [choice]);

    useEffect(() => {
        if (!a2fInfos.fa) return;

        authService
            .login({
                authConnectionDatas: a2fInfos,
            })
            .then((accountData) => {
                dispatch({
                    type: "SIGN_IN",
                    token: accountData.token,
                });
                authService.saveCredentials(
                    accountData.token,
                    accountData.data.accounts[0].id,
                    a2fInfos
                );
            });
    }, [a2fInfos.fa]);

    useEffect(() => {
        if (!state) return;
        console.log(state, "STATE");
    }, [state]);

    const authContext = useMemo(
        () => ({
            signIn: handleLogin, // data passed auto

            signOut: handleSignOut,
            mcqDatas,
            choice,
            setMcqDatas,
            setChoice,
        }),

        [mcqDatas, choice]
    );

    return (
        <signInContext.Provider value={authContext}>
            {children}
        </signInContext.Provider>
    );
};

export const useSingIn = () => useContext(signInContext);

