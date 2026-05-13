import {
    createContext,
    useContext,
    useEffect,
    useMemo,
} from "react";
import { getApiMessage } from "../constants/api/codes";
import { useAuthStore } from "../hooks/useAuthStore";

import { useNetwork } from "../hooks/network";
import authService from "../services/login/authService";
import { useUserStore } from "../hooks/useUserStore";
import { completeA2fLogin, handleA2fSubmit } from "./tools/a2fHandler";
import { tryLoginWithStoredCreds, tryRestoreToken } from "./tools/bootstrapAsync";
import storeDatas from "./tools/storeLoginDatas";

const SignInContext = createContext();

export const SignInProvider = ({ children }) => {
    const status = useAuthStore((state) => state.status);
    const error = useAuthStore((state) => state.error);
    const mcqDatas = useAuthStore((state) => state.mcqDatas);
    const choice = useAuthStore((state) => state.selectedChoice);
    const a2fInfos = useAuthStore((state) => state.a2fInfos);
    const gtk = useAuthStore((state) => state.gtk);
    const a2fToken = useAuthStore((state) => state.a2fToken);
    const keepConnected = useAuthStore((state) => state.keepConnected);

    const setStatus = useAuthStore((state) => state.setStatus);
    const setError = useAuthStore((state) => state.setError);
    const setMcqDatas = useAuthStore((state) => state.setMcqDatas);
    const setSelectedChoice = useAuthStore((state) => state.setSelectedChoice);
    const setA2fToken = useAuthStore((state) => state.setA2fToken);
    const setGtk = useAuthStore((state) => state.setGtk);
    const setA2fInfos = useAuthStore((state) => state.setA2fInfos);
    const setKeepConnected = useAuthStore((state) => state.setKeepConnected);
    const resetAuth = useAuthStore((state) => state.reset);

    const userAccesToken = useUserStore((state) => state.token);
    const setProfile = useUserStore((state) => state.setProfile);
    const setToken = useUserStore((state) => state.setToken);
    const network = useNetwork();

    const bootstrapAsync = async () => {
        try {
            const credentials = await authService.restoreCredentials();
            const hasCipher = Boolean(credentials?.cipherText);
            const hasLoginCreds = Boolean(credentials?.password);

            if (hasCipher) {
                const success = await tryLoginWithStoredCreds({
                    cipherText: credentials.cipherText,
                });
                if (success) return;
            }

            if (hasLoginCreds) {
                const restored = await tryRestoreToken({
                    credentialsPassword: credentials.password,
                });
                if (restored) return;
            }

            setStatus('idle');
        } catch (error) {
            console.error("ERROR IN BOOTSTRAPASYNC", error);
            setStatus('idle');
        }
    };

    const handleLogin = async ({ username, password, keepConnected }) => {
        setStatus('loading');
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
        setA2fInfos({
            identifiant: encodeURIComponent(username),
            motdepasse: encodeURIComponent(password),
        });

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

                setStatus('success');
                storeDatas({ data: accountData, token });
                break;
            case 250:
                authService
                    .startA2fProcess(apiLoginData.responseHeaders["2fa-token"])
                    .then(({ choices, question }) =>
                        setMcqDatas({
                            choices: choices,
                            question: question,
                        })
                    );
                setA2fToken(apiLoginData.responseHeaders["2fa-token"]);
                break;
            default:
                const message = getApiMessage(apiLoginData.code);
                setError(message || "Erreur de connexion");
                break;
        }
    };

    const handleSignOut = async () => {
        await authService.deleteCredentials();
        resetAuth();
        useUserStore.getState().reset();
    };

    useEffect(() => {
        bootstrapAsync();
    }, []);

    useEffect(() => {
        if (!choice) return;
        handleA2fSubmit({ a2fToken, choice, setA2fInfos, setSelectedChoice, setGtk });
    }, [choice]);

    useEffect(() => {
        if (!a2fInfos?.fa || a2fInfos.fa.length === 0 || !gtk) return;
        completeA2fLogin({
            a2fInfos,
            a2fToken,
            gtk: gtk,
            keepConnected,
        });
    }, [a2fInfos?.fa, gtk]);

    const authContext = useMemo(
        () => ({
            signIn: handleLogin,
            signOut: handleSignOut,
            state: {
                isLoading: status === 'loading' || status === 'booting',
                userToken: userAccesToken
            },
            mcqDatas,
            choice,
            apiError: error,
            setMcqDatas,
            setChoice: setSelectedChoice,
            setApiError: setError,
        }),
        [status, error, mcqDatas, choice, userAccesToken]
    );

    return (
        <SignInContext.Provider value={authContext}>
            {children}
        </SignInContext.Provider>
    );
};

export const useSingIn = () => useContext(SignInContext);

