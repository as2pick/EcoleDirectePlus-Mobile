import { parseNumber } from "../../../../utils/grades/makeAverage";

export default class Discipline {
    constructor({ code, libelle, averageDatas, coef, grades }) {
        this.code = code;
        this.libelle = libelle;
        this.averageDatas = averageDatas;
        this.coef = coef;
        this.grades = grades;
    }
    getTotalCoef() {
        return this.grades.reduce((sum, evaluation) => {
            const { notSignificant, data } = evaluation;
            const { coef, grade, outOf } = data;

            if (
                notSignificant ||
                grade === "" ||
                grade === null ||
                isNaN(grade) ||
                outOf === 0 ||
                outOf === "" ||
                isNaN(outOf) ||
                coef === 0 ||
                coef === "" ||
                isNaN(coef)
            ) {
                return sum;
            }

            return sum + coef;
        }, 0);
    }

    getWeightedAverage() {
        let totalWeightedScore = 0;
        let totalCoef = 0;

        this.grades.forEach((evaluation) => {
            const { notSignificant, data } = evaluation;
            const { grade, outOf, coef } = data;

            if (
                notSignificant ||
                grade === "" ||
                grade === null ||
                isNaN(grade) ||
                outOf === 0 ||
                outOf === "" ||
                isNaN(outOf) ||
                coef === 0 ||
                coef === "" ||
                isNaN(coef)
            ) {
                return;
            }

            const normalizedGrade = (grade / outOf) * 20;

            totalWeightedScore += normalizedGrade * coef;
            totalCoef += coef;
        });

        if (totalCoef === 0) return null;

        return parseNumber(totalWeightedScore / totalCoef);
    }
}
