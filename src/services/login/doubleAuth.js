import base64Handler from "../../utils/handleBase64.js";
import fetchApi from "../fetchApi.js";

export const getResponseChoices = async (token) => {
    const requestParams = {
        headers: {
            "X-Token": token,
        },
        method: "POST",
    };
    const responseDoubleAuthGetChoices = await fetchApi(
        "https://api.ecoledirecte.com/v3/connexion/doubleauth.awp?verbe=get&{API_VERSION}",
        requestParams
    );

    const doubleAuthGetChoices = responseDoubleAuthGetChoices.data;

    const question = doubleAuthGetChoices.question;
    const encodedChoices = doubleAuthGetChoices.propositions;
    const decodedChoices = encodedChoices.map((value) => {
        return base64Handler.decode(value);
    });

    const choices = decodedChoices.reduce((acc, key, index) => {
        // encoded and decoded array in object
        acc[key] = encodedChoices[index];
        return acc;
    }, {});
    return {
        choices: { ...choices },
        question: { [base64Handler.decode(question)]: question },
    };
};

export const sendResponseChoice = async (token, choice) => {
    const requestParams = {
        body: {
            choix: choice,
        },
        headers: {
            "X-Token": token,
        },
        method: "POST",
    };

    const fetchDoubleAuth = await fetchApi(
        "https://api.ecoledirecte.com/v3/connexion/doubleauth.awp?verbe=post&{API_VERSION}",
        requestParams
    );

    return fetchDoubleAuth;
};

