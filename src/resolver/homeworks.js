import fetchApi from "../services/fetchApi";
import { formatFrenchDate } from "../utils/date";

export default async function homeworksResolver({ token }) {
    const homeworksResponse = await fetchApi(
        "https://api.ecoledirecte.com/v3/Eleves/{USER_ID}/cahierdetexte.awp?verbe=get&{API_VERSION}",
        { headers: { "X-Token": token }, method: "POST" }
    );
    const homeworks = homeworksResponse.data;

    const entries = await Promise.all(
        Object.entries(homeworks).map(async ([date, value]) => {
            const details = await homeworksDetails({ date, token });
            return [date, details.disciplines];
        })
    );

    return {
        ...Object.fromEntries(entries),
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
// POST //api.ecoledirecte.com/v3/telechargement.awp?verbe=get&fichierId=3507&leTypeDeFichier=FICHIER_CDT&v=4.89.2

export async function homeworksDetails({ token, date }) {
    const homeworksDetailsResponse = await fetchApi(
        `https://api.ecoledirecte.com/v3/Eleves/{USER_ID}/cahierdetexte/${date}.awp?verbe=get&{API_VERSION}`,
        { headers: { "X-Token": token }, method: "POST" }
    );
    const homeworks = homeworksDetailsResponse.data;

    return {
        date: homeworks.date,
        disciplines: homeworks.matieres
            .filter((m) => m.aFaire !== undefined)
            .map((homework) => formatHomeworksDetails(homework, date)),
    };
}

function formatHomeworksDetails(
    {
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
    },
    date
) {
    let courseContent = "";
    if (
        contenuDeSeance !== undefined &&
        contenuDeSeance.contenu !== aFaire.contenu
    ) {
        courseContent = contenuDeSeance.contenu;
    } else {
        courseContent = aFaire.contenu;
    }
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
        isDone: aFaire?.effectue,
        returnOnline: aFaire?.rendreEnLigne,
        givenOn: aFaire?.donneLe,
        homeworksContent: {
            HTMLcontent: aFaire?.contenu,
            joinedDocuments: aFaire?.documents,
        },
        courseContent: courseContent,
    };
}

export async function toggleHomework({ token, id, state }) {
    const body = {
        ...(state && {
            idDevoirsEffectues: [id],
        }),
        ...(!state && { idDevoirsNonEffectues: [id] }),
    };
    fetchApi(
        `https://api.ecoledirecte.com/v3/Eleves/{USER_ID}/cahierdetexte.awp?verbe=put&{API_VERSION}`,
        {
            body,
            headers: { "X-Token": token },
            method: "POST",
        }
    ).catch((e) => console.log("An error expected in toggleHomework, ", e));
}

