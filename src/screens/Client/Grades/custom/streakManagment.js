import { parseNumber } from "../../../../utils/grades/makeAverage";
import Period from "./classes/Period";

export const createValidGradesArray = (gradesData, periodCode) => {
    if (!gradesData[periodCode]?.groups) return [];

    const disciplines = gradesData[periodCode].groups.flatMap((group) =>
        group.isDisciplineGroup ? group.disciplines : [group]
    );

    const gradesArray = disciplines.flatMap((discipline) =>
        Array.isArray(discipline.grades)
            ? discipline.grades.filter((grade) => {
                  const data = grade.data || {};
                  const gradeValue = data.grade;
                  const coef = data.coef;
                  const outOf = data.outOf;

                  return (
                      !grade.notSignificant &&
                      !grade.onlySkills &&
                      gradeValue !== "" &&
                      gradeValue !== null &&
                      !isNaN(gradeValue) &&
                      coef !== 0 &&
                      coef !== "" &&
                      !isNaN(coef) &&
                      outOf !== 0 &&
                      outOf !== "" &&
                      !isNaN(outOf)
                  );
              })
            : []
    );

    return gradesArray;
};

export const calculateWeightedAverageFromArray = (grades, disciplineCode = null) => {
    if (!Array.isArray(grades) || grades.length === 0) return null;

    const { total, totalCoef } = grades.reduce(
        (acc, grade) => {
            if (disciplineCode && grade.codes?.discipline !== disciplineCode)
                return acc;

            const value = (grade.data?.grade / grade.data?.outOf) * 20;
            const coef = grade.data?.coef;

            if (
                value !== null &&
                value !== "" &&
                !isNaN(value) &&
                coef !== null &&
                coef !== "" &&
                !isNaN(coef)
            ) {
                acc.total += value * coef;
                acc.totalCoef += coef;
            }

            return acc;
        },
        { total: 0, totalCoef: 0 }
    );

    return totalCoef > 0 ? parseNumber(total / totalCoef) : null;
};

export const sortGradesByDate = (grades) => {
    return grades
        .filter((grade) => grade.date)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
};

export const calculateStreak = (gradesArrayChronologicaly, periodCode, apiData) => {
    const periodObj = new Period(apiData[periodCode], periodCode);
    let gradesItered = [];
    let streakScores = periodObj.createReferentialStreakScore();
    let globalStreakScore = 0;

    for (const grade of gradesArrayChronologicaly) {
        if (gradesItered.length === 0) {
            grade.actionOnStreak = grade.data.grade >= 10 ? "up" : "nothing";

            if (grade.actionOnStreak === "up") {
                streakScores[periodCode][grade.codes.discipline] += 1;
                globalStreakScore += 1;
            }

            gradesItered.push(grade);
            continue;
        }

        const quantityOfGradesInDiscipline = gradesItered.filter(
            (g) => g.codes.discipline === grade.codes.discipline
        ).length;

        const oldGeneralAverage = calculateWeightedAverageFromArray(gradesItered);
        const oldDisciplineAverage = calculateWeightedAverageFromArray(
            gradesItered,
            grade.codes.discipline
        );

        gradesItered.push(grade);

        const newDisciplineAverage = calculateWeightedAverageFromArray(
            gradesItered,
            grade.codes.discipline
        );

        if (quantityOfGradesInDiscipline === 0) {
            if (newDisciplineAverage > oldGeneralAverage) {
                grade.actionOnStreak = "up";
                streakScores[periodCode][grade.codes.discipline] += 1;
                globalStreakScore += 1;
            } else {
                grade.actionOnStreak = "nothing";
            }
            continue;
        }

        if (newDisciplineAverage > oldDisciplineAverage) {
            grade.actionOnStreak = "up";
            streakScores[periodCode][grade.codes.discipline] += 1;
            globalStreakScore += 1;
        } else {
            grade.actionOnStreak = "nothing";
            globalStreakScore -= streakScores[periodCode][grade.codes.discipline];
            streakScores[periodCode][grade.codes.discipline] = 0;

            for (let g of gradesItered.filter(
                (g) => g.codes.discipline === grade.codes.discipline
            )) {
                if (g.actionOnStreak === "up") g.actionOnStreak = "previous up";
            }
        }
    }

    return {
        streakScores,
        globalStreakScore,
        gradesItered,
    };
};

