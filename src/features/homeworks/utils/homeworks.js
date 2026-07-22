import { formatDate, formatFrenchDate } from "@/utils/date";
import base64Handler from "@/utils/handleBase64";

export function createHomework(raw) {
    let isDone = "todo";
    if (raw.isDone === true || raw.isDone === "done") {
        isDone = "done";
    }

    return {
        courseContent: raw.courseContent,
        discipline: raw.discipline,
        givenOn: raw.givenOn || formatDate(new Date(), "ed"),
        homeworksContent: raw.homeworksContent,
        id: raw.id ?? null,
        isDone,
        loadingState: raw.loadingState || "idle",
        isEvaluation: raw.isEvaluation,
        returnOnline: raw.returnOnline ?? null,
        student: raw.student ?? null,
        customHomeworkMd5Key: raw.customHomeworkMd5Key ?? null,
        isCustom: raw.isCustom ?? false,
        date: raw.date,
        decodedHTMLCourseContent: "",
        decodedHTMLHomework: "",
    };
}

export function decodeHomeworkContent(homework) {
    return {
        ...homework,
        decodedHTMLCourseContent: homework.courseContent?.trim()
            ? base64Handler.decode(homework.courseContent)
            : "",
        decodedHTMLHomework: homework.homeworksContent?.content?.trim()
            ? base64Handler.decode(homework.homeworksContent.content)
            : "",
    };
}

export function serializeHomework(homework) {
    if (!homework.isCustom) return homework;
    return {
        ...homework,
        homeworksContent: {
            content: homework.homeworksContent.content,
            joinedDocuments: [],
        },
    };
}

export const assignUnit = (size) => {
    const absNombre = Math.abs(size);
    if (absNombre >= 1000000) {
        return (size / 1000000).toFixed(2).replace(/\.?0+$/, "") + " Mo";
    } else if (absNombre >= 1000) {
        return (size / 1000).toFixed(2).replace(/\.?0+$/, "") + " ko";
    } else {
        return size.toString();
    }
};

export function injectHomeworksIntoModel(model = {}, homeworksList = []) {
    const next = { ...model };
    const formatedDates = { ...(model.formatedDates ?? {}) };

    for (const homework of homeworksList) {
        const { date } = homework;
        if (!date) continue;

        const existing = next[date] ?? [];
        next[date] = [...existing, homework];

        const dayHomeworks = next[date];
        const totalEvaluations = dayHomeworks.filter((h) => h.isEvaluation).length;
        const allTasksCompleted = dayHomeworks.every((h) => h.isDone === "done");

        formatedDates[date] = {
            allTasksCompleted,
            isEvaluation: totalEvaluations > 0,
            totalEvaluations,
            long: formatedDates[date]?.long ?? formatFrenchDate(date),
            contracted: formatedDates[date]?.contracted ?? formatFrenchDate(date),
        };
    }

    next.formatedDates = formatedDates;
    return next;
}

