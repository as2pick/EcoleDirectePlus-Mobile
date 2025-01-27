import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useReducer,
    useState,
} from "react";
import * as Keychain from "react-native-keychain";
import { getApiMessage } from "../constants/api/codes";
import fetchApi from "../services/fetchApi";
import authService from "../services/login/authService";
import { useUser } from "./UserContext";
const signInContext = createContext();

export const SignInProvider = ({ children }) => {
    // app config

    const { globalUserData, setGlobalUserData } = useUser();

    const defaultLoginDatas = {
        identifiant: null,
        motdepasse: null,
        fa: null,
        userId: null,
    };

    const [a2fInfos, setA2fInfos] = useState("");
    const [choice, setChoice] = useState("");
    const [a2fToken, setA2fToken] = useState("");
    const [loginDatas, setLoginDatas] = useState(defaultLoginDatas);
    const [globalAccount, setGlobalAccount] = useState("");

    const keepLoginDatas = async (data) => {
        await Keychain.setGenericPassword(
            JSON.stringify({
                userToken: data.token,
                userId: data.data.accounts[0].id,
            }),
            JSON.stringify(loginDatas)
        );

        console.log("Datas was succesfully saved in Secure Store !");
    };

    const [state, dispatch] = useReducer((prevState, action) => {
        switch (action.type) {
            case "RESTORE_TOKEN_FROM_STORAGE":
                console.log("Token is sucessfully restored !");

                return {
                    ...prevState,
                    userToken: action.token,
                    isLoading: false,
                };
            case "SIGN_IN":
                keepLoginDatas(action.data);
                setGlobalAccount(action.data.data.accounts[0]);
                console.log("You are sucessfully connected !");
                return {
                    ...prevState,
                    isSignOut: false,
                    userToken: action.token,
                };

            case "SIGN_OUT":
                const deleteConnectionDatas = async () => {
                    await Keychain.resetGenericPassword();
                    console.log("Connection datas was succesfully deleted !");
                };

                deleteConnectionDatas();
                setGlobalAccount(""); // empty
                return {
                    ...prevState,
                    isSignOut: true,
                    userToken: false,
                };
        }
    });

    const checkTokenValidity = async (token, userId) => {
        return await fetchApi(
            `https://api.ecoledirecte.com/v3/E/${userId}/visios.awp?verbe=get&{API_VERSION}`, // check token of current account !
            {
                headers: {
                    "X-Token": token,
                },
                method: "POST",
            }
        ).then((response) => (response.code === 200 ? true : false));
    };

    const handleLogin = async (data) => {
        const { username, password } = data;

        setLoginDatas((prevState) => ({
            ...prevState,
            identifiant: encodeURIComponent(username),
            motdepasse: encodeURIComponent(password),
        }));

        const apiLoginData = await authService.login({
            username: username,
            password: password,
        });

        dispatch({ type: "SIGN_OUT" });

        switch (apiLoginData.code) {
            case 200:
                // anything, connected

                setLoginDatas({
                    identifiant: username,
                    motdepasse: password,
                    fa: [],
                });

                dispatch({
                    type: "SIGN_IN",
                    token: apiLoginData.token,
                    data: apiLoginData,
                });

                break;
            case 250:
                const { token } = apiLoginData;
                setA2fToken(token);
                const getChoices = await authService.startA2fProcess(token);

                setA2fInfos({
                    choices: getChoices.choices,
                    question: getChoices.question,
                });
                break;
            // finished in useEffect !
            // A2F required

            default:
                const message = getApiMessage(apiLoginData.code);

                if (message) {
                    console.log(message);
                } else
                    console.log({
                        error: "Bad error",
                    });
        }
    };

    useEffect(() => {
        // Fetch the token from storage then navigate to our appropriate place
        const bootstrapAsync = async () => {
            console.log("LOADED");
            let getCredentials;
            try {
                getCredentials = await Keychain.getGenericPassword();
                // Restore token stored in `SecureStore` or any other encrypted storage
                // userToken = await SecureStore.getItemAsync("userToken");

                if (getCredentials) {
                    let { userToken, userId } = JSON.parse(getCredentials.username);

                    const validToken = await checkTokenValidity(userToken, userId);

                    if (!validToken) {
                        // await Keychain.resetGenericPassword();
                        const getConnectionDatas = JSON.parse(
                            getCredentials.password
                        );
                        console.log("Invalid token, reloading...");
                        const accountData = await authService.login({
                            authConnectionDatas: getConnectionDatas,
                        });
                        userToken = accountData.token;
                        await Keychain.setGenericPassword(
                            JSON.stringify({
                                userToken: userToken,
                                userId: accountData.data.accounts[0].id,
                            }),
                            JSON.stringify(getConnectionDatas)
                        );

                        setGlobalAccount(accountData.data.accounts[0]);
                    }

                    dispatch({
                        type: "RESTORE_TOKEN_FROM_STORAGE",
                        token: userToken,
                    });
                } else {
                    console.log(
                        "Any token founded !, need to connect (handle this !!)"
                    );
                }

                // await Keychain.resetGenericPassword();
            } catch (e) {
                console.log("Restoring token failed", e);
                dispatch({ type: "SIGN_OUT" });
                // Restoring token failed
            }
            // After restoring token, we may need to validate it in production apps
            // This will switch to the App screen or Auth screen and this loading
            // screen will be unmounted and thrown away.
        };

        bootstrapAsync();
    }, []);

    useEffect(() => {
        if (!choice) return;
        authService.submitFormA2f(a2fToken, choice).then((fa) => {
            setLoginDatas((prevState) => ({
                ...prevState,
                fa: [{ ...fa.data }],
            }));
        });
        setChoice("");
        setA2fToken("");
    }, [choice]);

    useEffect(() => {
        if (!loginDatas) return;
        if (
            !Object.entries(loginDatas).every(([key, value]) =>
                key === "userId" ? true : Boolean(value)
            )
        )
            return;
        // here, loginData is completed with a2f !

        // last login if entered in A2F

        const handleAccountDataConnection = async () => {
            // accountData = apiLoginData

            if (state?.isSignOut === true) {
                const accountData = await authService.login({
                    authConnectionDatas: loginDatas,
                });

                dispatch({
                    type: "SIGN_IN",
                    token: accountData.token,
                    data: accountData,
                });
            }
        };

        handleAccountDataConnection();
        setLoginDatas("");
    }, [loginDatas]);

    useEffect(() => setGlobalUserData(globalAccount), [globalAccount]);

    useEffect(() => {
        if (!state) return;
        // console.log(state, "STATE");
    }, [state]);

    const authContext = useMemo(
        () => ({
            signIn: handleLogin, // data passed auto

            signOut: () => dispatch({ type: "SIGN_OUT" }),
            a2fInfos,
            choice,
            setA2fInfos,
            setChoice,
        }),

        [a2fInfos, choice]
    );

    return (
        <signInContext.Provider value={authContext}>
            {children}
        </signInContext.Provider>
    );
};

export const useSingIn = () => useContext(signInContext);

