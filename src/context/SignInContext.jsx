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
import { tryLoginWithStoredCreds, tryRestoreToken } from "./tools/bootstrapAsync";
import storeDatas from "./tools/storeLoginDatas";

const signInContext = createContext();

const defaultA2fInfos = {
    identifiant: null,
    motdepasse: null,
    fa: null,
    userId: null,
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
                    userToken: action.token,
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
    // const setUserData = (data, token) => {
    //     if (!data) {
    //         AsyncStorage.getItem("userData")
    //             .then((usrData) => {
    //                 if (usrData) {
    //                     data = JSON.parse(usrData);
    //                     console.log(data);
    //                 }
    //                 storeDatas(data, token);
    //             })
    //             .catch((err) => {
    //                 console.error(
    //                     "Erreur lors de la récupération des données :",
    //                     err
    //                 );
    //             });
    //     } else {
    //         storeDatas(data, token);
    //     }
    // };

    const bootstrapAsync = async () => {
        try {
            const credentials = await authService.restoreCredentials();

            const hasCipher = Boolean(credentials?.cipherText);
            const hasLoginCreds = Boolean(
                credentials?.password && credentials?.username
            );

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
            console.error("ERROR IN BOOTSTRAP ASYNC", error);
            dispatch({ type: "SIGN_OUT" });
        }
    };

    const handleLogin = async ({ username, password, keepConnected }) => {
        // console.log(username, password, keepConnected);

        // dispatch({ type: "SET_LOADING", value: true });

        setKeepConnected(keepConnected);
        console.log(keepConnected);
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

                dispatch({ type: "SIGN_IN", token: token });
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
        // Ftch the token from storage then navigate to our appropriate place

        bootstrapAsync();
        // console.log("bootstrapasync");
    }, []);

    const handleA2fSubmit = async (choice) => {
        authService.submitFormA2f(a2fToken, choice).then((fa) =>
            setA2fInfos((prevState) => ({
                ...prevState,
                fa: [{ ...fa.data }],
            }))
        );

        setChoice("");
        authService.generateGTK().then((gtkCookie) => setGtk(gtkCookie));
    };

    useEffect(() => {
        if (!choice) return;
        handleA2fSubmit(choice);
    }, [choice]);

    useEffect(() => {
        if (!a2fInfos.fa || a2fInfos.fa.length === 0) return;

        authService
            .login({
                authConnectionDatas: a2fInfos,
                headers: {
                    Cookie: gtk, // we call login so generate new GTK (generated before in handleA2fSubmit)
                    "X-GTK": gtk.split("=")[1], // we call login so generate new GTK (generated before in handleA2fSubmit)
                    "X-Token": a2fToken,
                },
            })
            .then((accountData) => {
                dispatch({
                    type: "SIGN_IN",
                    token: accountData.token,
                });
                if (keepConnected) {
                    authService.saveCredentials(
                        accountData.token,
                        accountData.data.accounts[0].id,
                        a2fInfos
                    );
                }
                storeDatas({
                    data: accountData.data.accounts[0],
                    token: accountData.token,
                    ...userSetters,
                });
            });
    }, [a2fInfos.fa]);

    useEffect(() => {
        if (state.isLoading && state.userToken) {
            // dispatch({ type: "SET_LOADING", value: false });
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

