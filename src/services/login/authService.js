import fetchApi from "../fetchApi";

import * as SecureStore from "expo-secure-store";
import { getCookiesFromResponse } from "../responseUtils";
import { getResponseChoices, sendResponseChoice } from "./doubleAuth";

const authService = {
    generateGTK: async () => {
        const rawGtkResponse = await fetchApi(
            "https://api.ecoledirecte.com/v3/login.awp?gtk=1&{API_VERSION}",
            { method: "GET" }
        );

        return getCookiesFromResponse(rawGtkResponse);
    },
    login: async ({
        username = "",
        password = "",
        authConnectionDatas = null,
        headers,
    }) => {
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
                method: "POST",
                headers: headers,
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
                method: "POST",
            }
        ).then((response) => (response.code === 200 ? true : false));
    },
    saveCredentials: async (token, userId, loginDatas) => {
        await SecureStore.setItemAsync(
            "username",
            JSON.stringify({ userLoginToken: token, userId: userId })
        );
        await SecureStore.setItemAsync("password", JSON.stringify(loginDatas));
    },
    restoreCredentials: async () => ({
        password: await SecureStore.getItemAsync("password"),
        username: await SecureStore.getItemAsync("username"),
    }),
    deleteCredentials: async () => {
        await SecureStore.deleteItemAsync("password");
        await SecureStore.deleteItemAsync("username");
    },
    getUserId: async () =>
        await JSON.parse(await SecureStore.getItemAsync("userame")).userId,
};

export default authService;

