import fetchApi from "../fetchApi";

import { getResponseChoices, sendResponseChoice } from "./doubleAuth";
// This function get account datas or start A2F process (and recalled after to get datas)
// used in SingInContext.jsx
const authService = {
    login: async ({ username = "", password = "", authConnectionDatas = null }) => {
        if (username == "" && password == "" && authConnectionDatas != null) {
            console.log("Restoring token in authService.js");
        }

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
            }
        );
    },

    startA2fProcess: async (token) => {
        return await getResponseChoices(token);
    },

    submitFormA2f: async (token, choice) => {
        return await sendResponseChoice(token, choice);
    },
};

export default authService;

// try {
//     if (payload == null && isSendReponse === false) {
//         console.log("Empty payload and not in A2F process !, cancelled");
//         return;
//     }

//     const fetchLoginData = await fetchApi(
//         `https://api.ecoledirecte.com/v3/login.awp?{API_VERSION}`,
//         {
//             body: payload,
//             method: "POST",
//         }
//     );
//     const loginData = await fetchLoginData;
//     // await singIn(await loginData);
//     if (loginData.code === 250)
//         return {
//             token: loginData.token,
//             ...(await getResponseChoices(loginData.token)),
//         };

//     if (isSendReponse) {
//         const fa = await sendResponseChoice(
//             isSendReponse.token,
//             isSendReponse.choice
//         );
//         const accountData = await Login({
//             identifiant: encodeURIComponent(username),
//             motdepasse: encodeURIComponent(password),
//             isReLogin: false, // edit this in future
//             cn: "",
//             cv: "",
//             uuid: 0, // WHY ?
//             fa: [...fa],
//         });

//         // console.log(accountData);
//     }
//     return {
//         ...loginData,
//     };
// } catch (error) {
//     console.error("Erreur:", error);
//     throw error;
// }

