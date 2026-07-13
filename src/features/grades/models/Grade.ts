import { FormattedGrade } from "../types";

export default class Grade {
    libelle: string;
    notSignificant: boolean;
    date: string;
    homeworkType: string;
    disciplineName: string;
    codes: { period: string; discipline: string };
    data: {
        coef: number;
        classAverage: number | null;
        outOf: number | null;
        classMax: number | null;
        classMin: number | null;
        grade: number | null;
    };
    skills: Array<{ name: string; description: string; value: string | null }>;
    onlySkills: boolean;
    isExam: boolean;
    actionOnStreak: "up" | "down" | "equal" | "nothing" | "previous up";
    badges: string[];
    isSimulation: boolean;

    constructor(gradeData: Partial<FormattedGrade> & { isSimulation?: boolean }) {
        this.libelle = gradeData.libelle || "";
        this.notSignificant = gradeData.notSignificant || false;
        this.date = gradeData.date || "";
        this.homeworkType = gradeData.homeworkType || "";
        this.disciplineName = gradeData.disciplineName || "";
        this.codes = gradeData.codes || { period: "", discipline: "" };
        this.data = gradeData.data || {
            coef: 0,
            classAverage: null,
            outOf: null,
            classMax: null,
            classMin: null,
            grade: null,
        };
        this.skills = gradeData.skills || [];
        this.onlySkills = gradeData.onlySkills || false;
        this.isExam = gradeData.isExam || false;
        this.actionOnStreak = gradeData.actionOnStreak || "nothing";
        this.badges = gradeData.badges || [];
        this.isSimulation = gradeData.isSimulation || false;
    }

    getGrade(): FormattedGrade & { isSimulation: boolean } {
        return {
            libelle: this.libelle,
            notSignificant: this.notSignificant,
            date: this.date,
            isExam: this.isExam,
            homeworkType: this.homeworkType,
            disciplineName: this.disciplineName,
            codes: this.codes,
            data: this.data,
            skills: this.skills,
            onlySkills: this.onlySkills,
            actionOnStreak: this.actionOnStreak,
            badges: this.badges,
            isSimulation: this.isSimulation,
        };
    }
}
