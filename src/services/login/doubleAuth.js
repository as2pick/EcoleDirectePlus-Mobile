import handleBase64 from "../../utils/handleBase64.js";
import fetchApi from "../fetchApi.js";

const ConvertOutput = (data) => {
    const handlePropositions = () => {
        const convertedArray = [];

        data.propositions.map((prop) => {
            convertedArray.push(handleBase64.decode(prop));
        });

        return convertedArray;
    };

    return {
        question: handleBase64.decode(data.question),
        propositions: handlePropositions(),
    };
};

export const getResponseChoices = async (token) => {
    const requestParams = {
        headers: {
            "X-Token": token,
        },
    };
    const responseDoubleAuthGetChoices = await fetchApi(
        "https://api.ecoledirecte.com/v3/connexion/doubleauth.awp?verbe=get&{API_VERSION}",
        requestParams
    );

    const doubleAuthGetChoices = responseDoubleAuthGetChoices.data;

    const question = doubleAuthGetChoices.question;
    const encodedChoices = doubleAuthGetChoices.propositions;
    const decodedChoices = encodedChoices.map((value) => {
        return handleBase64.decode(value);
    });

    const choices = decodedChoices.reduce((acc, key, index) => {
        // encoded and decoded array in object
        acc[key] = encodedChoices[index];
        return acc;
    }, {});
    return {
        choices: { ...choices },
        question: { [handleBase64.decode(question)]: question },
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
    };

    const fetchDoubleAuth = await fetchApi(
        "https://api.ecoledirecte.com/v3/connexion/doubleauth.awp?verbe=post&{API_VERSION}",
        requestParams
    );

    return fetchDoubleAuth;
};

