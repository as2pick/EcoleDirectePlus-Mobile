import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useReducer,
    useState,
} from "react";
import { getApiMessage } from "../constants/api/codes";

import dataManager from "../helpers/dataManager";
import authService from "../services/login/authService";
import { useUser } from "./UserContext";
import { completeA2fLogin, handleA2fSubmit } from "./tools/a2fHandler";
import { tryLoginWithStoredCreds, tryRestoreToken } from "./tools/bootstrapAsync";
import storeDatas from "./tools/storeLoginDatas";

const signInContext = createContext();

const defaultA2fInfos = {
    identifiant: null,
    motdepasse: null,
    fa: null,
};

export const SignInProvider = ({ children }) => {
    const {
        setGlobalUserData,
        globalUserData /* --> useless, just for display */,
        setUserAccesToken,
        userAccesToken,
        setIsConnected,
    } = useUser();

    const authReducer = (state, action) => {
        switch (action.type) {
            case "RESTORE_TOKEN":
                return {
                    ...state,
                    userToken: action.userToken,
                };
            case "SIGN_IN":
                return {
                    ...state,
                    isSignOut: false,
                    userToken: action.userToken,
                    isLoading: true, // important to allow app to fetch user data when loading screen appear
                };
            case "SIGN_OUT":
                return {
                    ...state,
                    isSignOut: true,
                    userToken: null,
                    isLoading: false,
                };
            case "SET_LOADING":
                return {
                    ...state,
                    isLoading: action.value,
                };
            default:
                return state;
        }
    };

    const [mcqDatas, setMcqDatas] = useState("");
    const [a2fInfos, setA2fInfos] = useState(defaultA2fInfos);
    const [choice, setChoice] = useState("");
    const [apiError, setApiError] = useState(null);
    const [keepConnected, setKeepConnected] = useState(true);
    const [gtk, setGtk] = useState("");
    const [a2fToken, setA2fToken] = useState("");

    const [state, dispatch] = useReducer(authReducer, {
        isLoading: true,
        isSignOut: false,
        userToken: null,
    });
    const userSetters = {
        setGlobalUserData,
        setUserAccesToken,
        setIsConnected,
    };

    const bootstrapAsync = async () => {
        try {
            const credentials = await authService.restoreCredentials();
            const hasCipher = Boolean(credentials?.cipherText);
            const hasLoginCreds = Boolean(credentials?.password);

            if (hasCipher) {
                const success = await tryLoginWithStoredCreds({
                    dispatch,
                    cipherText: credentials.cipherText,
                    userSetters,
                });
                if (success) return;
            }

            if (hasLoginCreds) {
                const restored = await tryRestoreToken({
                    dispatch,
                    credentialsPassword: credentials.password,
                    userSetters,
                });
                if (restored) return;

                console.log("Error when generating user token");
            }

            console.log("No valid credentials found, please login");
            dispatch({ type: "SIGN_OUT" });
        } catch (error) {
            console.error("ERROR IN BOOTSTRAPASYNC", error);
            dispatch({ type: "SIGN_OUT" });
        }
    };

    const handleLogin = async ({ username, password, keepConnected }) => {
        // console.log(username, password, keepConnected);

        setKeepConnected(keepConnected);
        const gtkCookie = await authService.generateGTK();
        const apiLoginData = await authService.login({
            username: username,
            password: password,
            headers: {
                Cookie: gtkCookie,
                "X-GTK": await gtkCookie.split("=")[1],
            },
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
                const accountData = data.accounts[0];
                if (keepConnected) {
                    await authService.saveCredentials(token, accountData.id, {
                        identifiant: encodeURIComponent(username),
                        motdepasse: encodeURIComponent(password),
                    });
                }

                dispatch({ type: "SIGN_IN", userToken: token });
                storeDatas({ data: accountData, token, ...userSetters });
                break;
            case 250:
                authService.startA2fProcess(token).then(({ choices, question }) =>
                    setMcqDatas({
                        choices: choices,
                        question: question,
                    })
                );
                setA2fToken(token);

                break;
            default:
                const message = getApiMessage(apiLoginData.code);
                if (message) {
                    console.log(message);
                    setApiError(message);
                } else
                    console.log({
                        error: "Bad error",
                    });
                setA2fInfos("");
                break;
        }
    };

    const handleSignOut = async () => {
        await authService.deleteCredentials();
        dispatch({ type: "SIGN_OUT" });
        setGlobalUserData(null);
    };

    useEffect(() => {
        bootstrapAsync();
    }, []);

    useEffect(() => {
        if (!choice) return;
        handleA2fSubmit({ a2fToken, choice, setA2fInfos, setChoice, setGtk });
    }, [choice]);

    useEffect(() => {
        if (!a2fInfos.fa || a2fInfos.fa.length === 0 || !gtk) return;
        completeA2fLogin({
            a2fInfos,
            a2fToken,
            dispatch,
            gtk: gtk,
            keepConnected,
            userSetters,
        });
    }, [a2fInfos.fa, gtk]);

    useEffect(() => {
        if (state.isLoading && state.userToken) {
            dataManager(state.userToken).finally(() => {
                dispatch({ type: "SET_LOADING", value: false });
            });
        }
    }, [state.isLoading, state.userToken]); // this useEffect is to load all API datas in the splash screen to save performance

    const authContext = useMemo(
        () => ({
            signIn: handleLogin, // data passed auto
            signOut: handleSignOut,
            state,
            mcqDatas,
            choice,
            apiError,
            setMcqDatas,
            setChoice,
            setApiError,
        }),

        [mcqDatas, choice, state, apiError]
    );

    return (
        <signInContext.Provider value={authContext}>
            {children}
        </signInContext.Provider>
    );
};

export const useSingIn = () => useContext(signInContext);

