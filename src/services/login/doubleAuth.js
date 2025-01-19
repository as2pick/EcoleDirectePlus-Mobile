import handleBase64 from "../../utils/handleBase64.js";

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
        body: "data={}",
        headers: {
            "X-Token": token,
            "Content-Type": "text/plain",
            "User-Agent":
                "Mozilla/5.0 (X11; Linux x86_64; rv:134.0) Gecko/20100101 Firefox/134.0",
        },
        method: "POST",
    };
    const fetchDoubleAuth = await fetch(
        "https://api.ecoledirecte.com/v3/connexion/doubleauth.awp?verbe=get&v=4.69.1",
        requestParams
    );

    const fetchDoubleAuthResponseConvert = await JSON.parse(
        await fetchDoubleAuth.text()
    );

    // const {proposition} = ConvertOutput(fetchDoubleAuthResponseConvert.data)
    return {
        code: 250, // beacause we are in A2F process it's the EcoleDirecte code.
        decodedData: ConvertOutput(fetchDoubleAuthResponseConvert.data),
        encodedPropositions: fetchDoubleAuthResponseConvert.data.propositions,
    };
};

export const sendResponseChoice = async (token, choice) => {
    const requestParams = {
        body: `data=${JSON.stringify({
            choix: handleBase64.encode(choice),
        })}`,
        headers: {
            "X-Token": token,
            "Content-Type": "text/plain",
            "User-Agent":
                "Mozilla/5.0 (X11; Linux x86_64; rv:134.0) Gecko/20100101 Firefox/134.0",
        },
        method: "POST",
    };

    const fetchDoubleAuth = await fetch(
        "https://api.ecoledirecte.com/v3/connexion/doubleauth.awp?verbe=post&v=4.69.1",
        requestParams
    );

    const fetchDoubleAuthResponseConvert = await JSON.parse(
        await fetchDoubleAuth.text()
    );

    return fetchDoubleAuthResponseConvert;
};

