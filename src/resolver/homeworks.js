import fetchApi from "../services/fetchApi";

export default async function homeworksResolver({ token }) {
    // return "homeworks";
    const homeworksResponse = await fetchApi(
        "https://api.ecoledirecte.com/v3/Eleves/{USER_ID}/cahierdetexte.awp?verbe=get&{API_VERSION}",
        { headers: { "X-Token": token }, method: "POST" }
    );
    const homeworks = homeworksResponse.data;
    return transformObject(homeworks);
    // return homeworksResponse.data;
}

function transformObject(obj) {
    return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => {
            return [
                key,
                value.map((homework) => formatHomeworkDiscipline(homework)),
            ];
        })
    );
}

function formatHomeworkDiscipline({
    matiere,
    codeMatiere,
    aFaire,
    idDevoir,
    documentsAFaire,
    donneLe,
    effectue,
    interrogation,
    rendreEnLigne,
    tags,
}) {
    return {
        discipline: {
            name: matiere,
            code: codeMatiere,
        },
        isDone: effectue,
        isEvaluation: interrogation,
        returnOnline: rendreEnLigne,
        givenOn: donneLe,
        id: idDevoir,
    };
}

