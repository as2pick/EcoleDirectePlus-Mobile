import authService from "../../services/login/authService";
import { useAuthStore } from "../../hooks/useAuthStore";
import storeDatas from "./storeLoginDatas";

export const handleA2fSubmit = async ({
    a2fToken,
    choice,
    setA2fInfos,
    setSelectedChoice,
    setGtk,
}) => {
    const fa = await authService.submitFormA2f(a2fToken, choice);
    setA2fInfos({
        fa: [{ ...fa.data }],
    });
    setSelectedChoice("");
    const gtkCookie = await authService.generateGTK();
    setGtk(gtkCookie);
};

export const completeA2fLogin = async ({
    a2fInfos,
    gtk,
    a2fToken,
    keepConnected,
}) => {
    const accountData = await authService.login({
        authConnectionDatas: a2fInfos,
        headers: {
            Cookie: gtk,
            "X-GTK": gtk.split("=")[1],
            "X-Token": a2fToken,
        },
    });

    const account = accountData.data.accounts[0];
    const token = accountData.token;

    if (keepConnected) {
        await authService.saveCredentials(token, account.id, a2fInfos);
    }
    storeDatas({
        data: account,
        token,
    });
    
    useAuthStore.getState().setAuthenticated(true);
};

