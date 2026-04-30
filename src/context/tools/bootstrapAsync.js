import dayjs from "dayjs";
import { payloadHelper } from "../../helpers/cryptoHelper";
import useUserDatas from "../../hooks/useUserDatas";
import authService from "../../services/login/authService";
import { useAuthStore } from "../../hooks/useAuthStore";
import storeDatas from "./storeLoginDatas";

/**
 * Get token and user data from storage
 * @param {Object} credentialsCipherText
 * @returns {Promise<string|null>}
 */

export async function tryLoginWithStoredCreds({
    cipherText,
    userSetters,
}) {
    try {
        const payload = await payloadHelper.decrypt({ cipherHex: cipherText });
        const now = dayjs();
        const expiration = dayjs(payload.expirationDate, "YYYY-MM-DD_HH:mm");

        if (now.isBefore(expiration)) {
            const getDataFromStorage = useUserDatas.getState().globalUserData;

            storeDatas({
                data: getDataFromStorage,
                token: payload.superSecretUserToken,
                ...userSetters,
            });

            useAuthStore.getState().setStatus('success');
            return true;
        }
        return false;
    } catch (error) {
        console.log("Error in tryLoginWithStoredCreds:", error);
        return false;
    }
}

export async function tryRestoreToken({
    credentialsPassword,
    userSetters,
}) {
    try {
        const authData = JSON.parse(credentialsPassword);
        const gtkCookie = await authService.generateGTK();

        const { data, token } = await authService.login({
            authConnectionDatas: authData,
            headers: {
                Cookie: gtkCookie,
                "X-GTK": gtkCookie.split("=")[1],
            },
        });

        const accountData = data.accounts[0];

        storeDatas({
            data: accountData,
            token,
            ...userSetters,
        });

        await authService.saveCredentials(token, accountData.id, authData);
        useAuthStore.getState().setStatus('success');
        return true;
    } catch (error) {
        console.error("Error in tryRestoreToken:", error);
        return false;
    }
}

