import fetchApi from "../fetchApi";

import * as Keychain from "react-native-keychain";
import { getResponseChoices, sendResponseChoice } from "./doubleAuth";

const authService = {
    login: async ({ username = "", password = "", authConnectionDatas = null }) => {
        return await fetchApi(
            "https://api.ecoledirecte.com/v3/login.awp?{API_VERSION}",
            {
                body:
                    authConnectionDatas != null
                        ? {
                              ...authConnectionDatas,
                          }
                        : {
                              identifiant: username,
                              motdepasse: password,
                              isReLogin: false,
                              uuid: "",
                          },
            }
        );
    },

    startA2fProcess: async (token) => {
        return await getResponseChoices(token);
    },

    submitFormA2f: async (token, choice) => {
        return await sendResponseChoice(token, choice);
    },

    checkTokenValidity: async (token, userId) => {
        return await fetchApi(
            `https://api.ecoledirecte.com/v3/E/${userId}/visios.awp?verbe=get&{API_VERSION}`, // check token of current account !
            {
                headers: {
                    "X-Token": token,
                },
            }
        ).then((response) => (response.code === 200 ? true : false));
    },
    saveCredentials: async (token, userId, loginDatas) => {
        Keychain.setGenericPassword(
            JSON.stringify({ userLoginToken: token, userId: userId }),
            JSON.stringify(loginDatas)
        );
    },
    restoreCredentials: async () => Keychain.getGenericPassword(),
    deleteCredentials: async () => Keychain.resetGenericPassword(),
    getUserId: async () =>
        await JSON.parse(await Keychain.getGenericPassword()).username.userId,
};

export default authService;

