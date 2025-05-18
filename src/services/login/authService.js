import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { payloadHelper } from "../../helpers/cryptoHelper";
import { originName } from "../../resolver/resolver";
import fetchApi from "../fetchApi";
import { getCookiesFromResponse } from "../responseUtils";
import { getResponseChoices, sendResponseChoice } from "./doubleAuth";
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
            "userData",
        ];
        keyNames.map(async (key) => {
            await SecureStore.deleteItemAsync(key);
            console.log("Deleted key:", key);
        });
        await AsyncStorage.clear();
    },
    getUserId: async () =>
        await JSON.parse(await SecureStore.getItemAsync("userame")).userId,
    storeUserData: async ({
        id,
        // identifiant,
        prenom,
        nom,
        email,
        nomEtablissement,
        profile: {
            sexe,
            telPortable,
            classe: { code, libelle },
        },
    }) => {
        const userData = {
            id,
            name: prenom,
            surname: nom,
            sex: sexe,
            phone: telPortable,
            email,
            schoolName: nomEtablissement,
            class: {
                libelle,
                code,
            },
        };
        await AsyncStorage.setItem("userData", JSON.stringify(userData));
    },

    deleteStoredApiDatas: async () => {
        try {
            originName.map((origin) => {
                AsyncStorage.removeItem(origin);
                console.log(`Deleted key in AsyncStorage ${origin}`);
            });
        } catch (e) {
            console.log("Error in deleteStoredApiDatas", e);
        }
    },
};

export default authService;

