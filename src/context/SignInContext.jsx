import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useReducer,
    useState,
} from "react";
import { getApiMessage } from "../constants/api/codes";

import { API } from "../constants/api/api";
import authService from "../services/login/authService";
import { useUser } from "./UserContext";

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
        setIsConnected,
    } = useUser();

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
                    isLoading: false,
                };
            case "SIGN_OUT":
                return {
                    ...state,
                    isSignOut: true,
                    userToken: null,
                    isLoading: false,
                };
        }
    };

    const [mcqDatas, setMcqDatas] = useState("");
    const [a2fInfos, setA2fInfos] = useState(defaultA2fInfos);
    const [choice, setChoice] = useState("");
    const [successLogin, setSuccedLogin] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [keepConnected, setKeepConnected] = useState(true);
    const [gtk, setGtk] = useState("");
    const [a2fToken, setA2fToken] = useState("");

    const [state, dispatch] = useReducer(authReducer, {
        isLoading: true,
        isSignOut: false,
        userToken: null,
    });

    const setUserData = (data, token) => {
        setGlobalUserData(data.accounts[0]);
        setUserAccesToken(token);
        setSuccedLogin(true);
        API.USER_ID = data.accounts[0].id;
        setIsConnected(true);
    };

    const bootstrapAsync = async () => {
        try {
            const credentials = await authService.restoreCredentials();
            if (credentials.password && credentials.username) {
                const gtkCookie = await authService.generateGTK();

                const getConnectionDatas = JSON.parse(credentials.password);

                authService
                    .login({
                        authConnectionDatas: getConnectionDatas,
                        headers: {
                            Cookie: gtkCookie,
                            "X-GTK": gtkCookie.split("=")[1],
                        },
                    })
                    .then(({ data, token }) => {
                        dispatch({ type: "RESTORE_TOKEN", token });
                        setUserData(data, token);
                    })
                    .catch((error) =>
                        console.error("Error in login of restoring token : ", error)
                    );
                // here token is restored sucessfully
                console.log("Token renewed sucessfully");
            } else {
                // need to login
                console.log("No existing token or invalid ID, please login");
                dispatch({ type: "SIGN_OUT" });
            }
        } catch (error) {
            console.error("ERROR IN BOOTSTRAP ASYNC", error);
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
                const account = data.accounts[0];
                if (keepConnected) {
                    await authService.saveCredentials(token, account.id, {
                        identifiant: encodeURIComponent(username),
                        motdepasse: encodeURIComponent(password),
                    });
                }

                dispatch({ type: "SIGN_IN", token: token });
                setUserData(data, token);
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
                setUserData(accountData.data, accountData.token);
            });
    }, [a2fInfos.fa]);

    useEffect(() => {
        if (state.isLoading || state.isSignOut || !state.userToken) return;
        // here we are connected
        console.log(
            `Sucessfully connected as ${globalUserData.prenom} ${globalUserData.nom}`
        );
    }, [state]);

    const authContext = useMemo(
        () => ({
            signIn: handleLogin, // data passed auto
            signOut: handleSignOut,
            state,
            mcqDatas,
            choice,
            successLogin,
            apiError,
            setMcqDatas,
            setChoice,
            setSuccedLogin,
            setApiError,
        }),

        [mcqDatas, choice, state, successLogin, apiError]
    );

    return (
        <signInContext.Provider value={authContext}>
            {children}
        </signInContext.Provider>
    );
};

export const useSingIn = () => useContext(signInContext);

