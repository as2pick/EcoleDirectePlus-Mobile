import moment from "moment";
import { payloadHelper } from "../../helpers/cryptoHelper";
import { storageServiceStates } from "../../helpers/storageService";
import authService from "../../services/login/authService";
import storeDatas from "./storeLoginDatas";

/**
 * Get token and user data from storage
 * @param {Function} dispatch
 * @param {Object} credentialsCipherText
 * @returns {Promise<string|null>}
 */

export async function tryLoginWithStoredCreds({
    dispatch,
    cipherText,
    userSetters,
}) {
    try {
        const payload = await payloadHelper.decrypt({ cipherHex: cipherText });
        const now = moment();
        const expiration = moment(payload.expirationDate, "YYYY-MM-DD_HH:mm");

        if (now.isBefore(expiration)) {
            dispatch({ type: "SIGN_IN", userToken: payload.superSecretUserToken });
            const getDataFromStorage = await storageServiceStates.getter({
                originKey: "userData",
            });

            storeDatas({
                data: getDataFromStorage,
                token: payload.superSecretUserToken,
                ...userSetters,
            });

            return true;
        }
        return false;
    } catch (error) {
        console.log("Error in tryLoginWithStoredCreds:", error);
        return false;
    }
}

export async function tryRestoreToken({
    dispatch,
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
        dispatch({ type: "SIGN_IN", userToken: token });

        storeDatas({
            data: accountData,
            token,
            ...userSetters,
        });

        await authService.saveCredentials(token, accountData.id, authData);
        return true;
    } catch (error) {
        console.error("Error in tryRestoreToken:", error);
        return false;
    }
}

