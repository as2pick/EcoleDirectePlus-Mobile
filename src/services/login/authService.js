import { createMMKV } from "react-native-mmkv";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { payloadHelper } from "../../helpers/cryptoHelper";
import { useUserStore } from "../../hooks/useUserStore";
import { useColorStore } from "../../hooks/useColorStore";
import { originName } from "../../resolver/resolver";
import fetchApi from "../fetchApi";
import { getCookiesFromResponse } from "../responseUtils";
import { getResponseChoices, sendResponseChoice } from "./doubleAuth";

const storage = createMMKV();
const { localSecretKeyStoreName } = Constants.expoConfig.extra;

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

    saveCredentials: async (token, userId, loginDatas) => {
        await SecureStore.setItemAsync("password", JSON.stringify(loginDatas)); // stringify loginDatas
        const cipherText = await payloadHelper.encrypt({
            connectionToken: token,
            userId: userId,
        });

        await SecureStore.setItemAsync(
            `${localSecretKeyStoreName}Payload`,
            cipherText
        );
    },
    restoreCredentials: async () => ({
        password: await SecureStore.getItemAsync("password"),
        cipherText: await SecureStore.getItemAsync(
            `${localSecretKeyStoreName}Payload`
        ),
    }),
    deleteCredentials: async () => {
        const keyNames = [
            localSecretKeyStoreName,
            `${localSecretKeyStoreName}Payload`,
            "password",
        ];
        await Promise.all(keyNames.map((key) => SecureStore.deleteItemAsync(key)));
        useUserStore.getState().reset();
        useColorStore.getState().reset();
        storage.clearAll();
    },

    deleteStoredApiDatas: async () => {
        try {
            originName.map((origin) => {
                storage.remove(origin);
                console.log(`Deleted key in MMKV ${origin}`);
            });
            ["@user_theme", "@follow_system_theme"].map((d) => {
                storage.remove(d);
                console.log(`Deleted key in MMKV ${d}`);
            });
        } catch (e) {
            console.log("Error in deleteStoredApiDatas", e);
        }
    },
};


export default authService;

