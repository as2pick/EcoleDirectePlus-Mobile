import { useColorStore } from "../hooks/useColorStore";
import { createHomework } from "../screens/Client/Homeworks/utils";
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
            const homework = details.disciplines.map((hk) =>
                createHomework({ ...hk, date })
            );

            return [date, homework];
        })
    );

    return {
        ...Object.fromEntries(entries),
        formatedDates: extractDates(homeworks),
    };
}

function extractDates(homeworks) {
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
                    allTasksCompleted: false,
                },
            ];
        })
    );
}

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
    const DEFAULT_BASE64_MESSAGE =
        "PHA+Vm91cyBuJ2F2ZXogcGFzIGRlIGNvbnRlbnUgZGUgc8OpYW5jZTwvcD4=";

    const hkContent = aFaire?.contenuDeSeance?.contenu;
    const seanceContent = contenuDeSeance?.contenu;

    let courseContent = DEFAULT_BASE64_MESSAGE;

    if (typeof hkContent === "string" && hkContent.trim() !== "") {
        courseContent = hkContent;
    } else if (typeof seanceContent === "string" && seanceContent.trim() !== "") {
        courseContent = seanceContent;
    }

    return {
        discipline: {
            name: matiere,
            code: codeMatiere,
            teacher: nomProf,
            color: useColorStore.getState().getOrAssignColor(codeMatiere),
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
            content: aFaire?.contenu,
            joinedDocuments: aFaire?.documents,
        },
        courseContent: courseContent,
    };
}

export async function toggleHomeworkInApi({ token, id, state }) {
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

const isEmptyValue = (value) =>
    value == null || (typeof value === "string" && value.trim() === "");

