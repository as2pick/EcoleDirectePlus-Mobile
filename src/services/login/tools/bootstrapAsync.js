import dayjs from "dayjs";
import { payloadHelper } from "@/helpers/cryptoHelper";
import { useUserStore } from "@/hooks/useUserStore";
import authService from "../authService";
import { useAuthStore } from "@/hooks/useAuthStore";
import storeDatas from "./storeLoginDatas";

/**
 * Get token and user data from storage
 * @param {Object} credentialsCipherText
 * @returns {Promise<string|null>}
 */

export async function tryLoginWithStoredCreds({
    cipherText,
}) {
    try {
        const payload = await payloadHelper.decrypt({ cipherHex: cipherText });
        const now = dayjs();
        const expiration = dayjs(payload.expirationDate, "YYYY-MM-DD_HH:mm");

        if (now.isBefore(expiration)) {
            const getDataFromStorage = useUserStore.getState().profile;

            storeDatas({
                data: getDataFromStorage,
                token: payload.superSecretUserToken,
            });

            useAuthStore.getState().setAuthenticated(true);
            useAuthStore.getState().setBooting(false);
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
}) {
    try {
        const authData = JSON.parse(credentialsPassword);
        const gtkCookie = await authService.generateGTK();

        const loginResponse = await authService.login({
            authConnectionDatas: authData,
            headers: {
                Cookie: gtkCookie,
                "X-GTK": gtkCookie.split("=")[1],
            },
        });

        if (loginResponse?.code === 505 || loginResponse?.code === 522) {
            console.warn("Stored credentials are no longer valid (505/522). Clearing credentials.");
            await authService.deleteCredentials();
            return false;
        }

        const { data, token } = loginResponse;

        const accountData = data?.accounts?.[0];
        if (!accountData) {
            console.error("No account found during token restoration");
            return false;
        }

        storeDatas({
            data: accountData,
            token,
        });

        await authService.saveCredentials(token, accountData.id, authData);
        useAuthStore.getState().setAuthenticated(true);
        useAuthStore.getState().setBooting(false);
        return true;
    } catch (error) {
        console.error("Error in tryRestoreToken:", error);
        return false;
    }
}
