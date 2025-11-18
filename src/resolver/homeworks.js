import fetchApi from "../services/fetchApi";
import { formatFrenchDate } from "../utils/date";

export default async function homeworksResolver({ token }) {
    // return "homeworks";
    const homeworksResponse = await fetchApi(
        "https://api.ecoledirecte.com/v3/Eleves/{USER_ID}/cahierdetexte.awp?verbe=get&{API_VERSION}",
        { headers: { "X-Token": token }, method: "POST" }
    );
    const homeworks = homeworksResponse.data;

    return {
        ...Object.fromEntries(
            Object.entries(homeworks).map(([key, value]) => {
                return [
                    key,
                    value.map((homework) => formatHomeworkDiscipline(homework)),
                ];
            })
        ),
        formatedDates: extractEvaluationDays(homeworks),
    };
}

function extractEvaluationDays(homeworks) {
    const evaluationsDates = [];
    Object.entries(homeworks).map(([date, value]) => {
        value.forEach(({ interrogation }) => {
            if (interrogation) evaluationsDates.push(date);
        });
    });

    const countMap = new Map();
    evaluationsDates.forEach((date) => {
        countMap.set(date, (countMap.get(date) || 0) + 1);
    });

    return Object.fromEntries(
        Object.keys(homeworks).map((date) => {
            const frenchDate = formatFrenchDate(date);
            const contractedDate = [
                frenchDate.charAt(0).toLowerCase() + frenchDate.slice(1, 3),
                frenchDate.split(" ")[1],
            ];
            return [
                date,
                {
                    long: frenchDate,
                    contracted: contractedDate,
                    isEvaluation: evaluationsDates.includes(date),
                    totalEvaluations: countMap.get(date),
                },
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

export async function homeworksDetails({ token, date }) {
    const homeworksDetailsResponse = await fetchApi(
        `https://api.ecoledirecte.com/v3/Eleves/{USER_ID}/cahierdetexte/${date}.awp?verbe=get&{API_VERSION}`,
        { headers: { "X-Token": token }, method: "POST" }
    );
    const homeworks = homeworksDetailsResponse.data;

    return {
        date: homeworks.date,
        disciplines: homeworks.matieres.map((homework) =>
            formatHomeworksDetails(homework)
        ),
    };
}

function formatHomeworksDetails({
    entityCode,
    entityLibelle,
    entityType,
    matiere,
    codeMatiere,
    nomProf,
    id,
    interrogation,
    blogActif,
    nbJourMaxRenduDevoir,
    aFaire,
    contenuDeSeance,
}) {
    return {
        discipline: {
            name: matiere,
            code: codeMatiere,
            teacher: nomProf,
        },
        student: {
            // maybe so useless
            class: entityLibelle,
            classCode: entityCode,
        },
        id,
        isEvaluation: interrogation,
        isDone: aFaire.effectue,
        returnOnline: aFaire.rendreEnLigne,
        givenOn: aFaire.donneLe,
        homeworksContent: aFaire.contenu,
        courseContent: contenuDeSeance.contenu,
    };
}

export async function setHomeworkDone({ token, id, done = true }) {
    const body = {
        ...(done && {
            idDevoirsEffectues: [id],
        }),
        ...(!done && { idDevoirsNonEffectues: [id] }),
    };
    fetchApi(
        `https://api.ecoledirecte.com/v3/Eleves/{USER_ID}/cahierdetexte.awp?verbe=put&{API_VERSION}`,
        {
            body,
            headers: { "X-Token": token },
            method: "POST",
        }
    ).catch((e) => console.log("An error expected in setHomeworkDone, ", e));
}

