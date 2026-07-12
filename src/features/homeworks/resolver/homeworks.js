import { useColorStore } from "@/hooks/useColorStore";
import { createHomework } from "../utils/homeworks";
import { extractDates } from "../utils/dates";
import fetchApi from "@/services/fetchApi";

export default async function homeworksResolver({ token }) {
    const homeworksResponse = await fetchApi(
        "https://api.ecoledirecte.com/v3/Eleves/{USER_ID}/cahierdetexte.awp?verbe=get&{API_VERSION}",
        { headers: { "X-Token": token }, method: "POST" }
    );
    if (homeworksResponse.isDataEmpty) {
        return {};
    }
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
    entries.sort((a, b) => a[0].localeCompare(b[0]));

    return {
        ...Object.fromEntries(entries),
        formatedDates: extractDates(homeworks),
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
