export interface HomeworkDiscipline {
    name: string;
    code?: string;
    teacher?: string;
    color?: string;
    textColor?: string;
}

export interface HomeworkContent {
    content: string | null;
    joinedDocuments: any[];
}

export interface Homework {
    id: number;
    date: string;
    discipline: HomeworkDiscipline;
    homeworksContent: HomeworkContent;
    isDone: "done" | "todo";
    loadingState?: "idle" | "loading" | "error";
    isEvaluation: boolean;
    isCustom: boolean;
    givenOn: string;
    returnOnline: boolean | null;
    student: { class: string; classCode: string } | null;
    courseContent: string | null;
    decodedHTMLCourseContent: string;
    decodedHTMLHomework: string;
    customHomeworkMd5Key: string | null;
}

export interface FormattedDate {
    long: string;
    contracted: [string, string];
    isEvaluation: boolean;
    totalEvaluations?: number;
    allTasksCompleted: boolean;
}

export type ResolvedHomeworks = Record<string, Homework[]> & {
    formatedDates: Record<string, FormattedDate>;
};
