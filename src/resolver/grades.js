import Discipline from "../screens/Client/Grades/grades/classes/Discipline";
import { deepEqualExcept } from "../screens/Client/Grades/grades/helper";
import {
    calculateStreak,
    createValidGradesArray,
    sortGradesByDate,
} from "../screens/Client/Grades/grades/streakManagment";
import fetchApi from "../services/fetchApi";
import { parseNumber } from "../utils/grades/makeAverage";
import base64Handler from "../utils/handleBase64";

export default async function gradesResolver({ token }) {
    try {
        const gradesResponse = await fetchApi(
            "https://api.ecoledirecte.com/v3/eleves/{USER_ID}/notes.awp?verbe=get&{API_VERSION}",
            {
                headers: { "X-Token": token },
                method: "POST",
                body: {
                    anneeScolaire: "",
                },
            }
        );
        const grades = gradesResponse.data;
        // const grades = require("../../test/api.json").data;
        // Format periods
        const periodsObj = grades.periodes.reduce((acc, period) => {
            if (period.annuel) return acc;

            const groups = [];
            let currentGroup = null;

            for (const disciplineRaw of period.ensembleMatieres.disciplines) {
                const discipline = parseDiscipline(disciplineRaw);

                if (discipline.isDisciplineGroup) {
                    delete discipline.code;
                    delete discipline.coef;

                    currentGroup = {
                        ...discipline,
                        disciplines: [],
                        disciplineCodes: [],
                    };

                    groups.push(currentGroup);
                } else if (currentGroup) {
                    currentGroup.disciplines.push(discipline);
                    currentGroup.disciplineCodes.push(discipline.code);
                } else {
                    groups.push(discipline);
                }
            }

            acc[period.codePeriode] = {
                groups,
                periodName: period.periode,
            };

            return acc;
        }, {});
        // Enrich disciplines with grades, averages, streaks
        for (const [periodCode, periodData] of Object.entries(periodsObj)) {
            periodData.groups = periodData.groups.map((group) => {
                if (group.isDisciplineGroup) {
                    group.disciplines = group.disciplines.map((discipline) => {
                        return enrichDiscipline(
                            discipline,
                            periodCode,
                            grades.notes
                        );
                    });
                    group.averageDatas.userAverage = new Discipline(
                        group
                    ).getDisciplineGroupAverage();
                    return group;
                } else {
                    return enrichDiscipline(group, periodCode, grades.notes);
                }
            });
        }

        return streakDataInjectedIntoGrades(periodsObj);
    } catch (error) {
        console.error("Error fetching grades:", error);
        throw error;
    }
}

const skillColorsCodes = {
    "-3": "not rated",
    "-2": "dispensed",
    "-1": "abscent",
    1: "red",
    2: "yellow",
    3: "blue",
    4: "green",
};

function parseDiscipline(discipline) {
    // if (!discipline) return undefined;

    const teachersWithoutId =
        discipline.professeurs?.map(({ nom }) => [nom]) || undefined;

    const decodedClassAssessment =
        base64Handler.decode(discipline.appreciationClasse) || undefined;

    let decodedUserAssessment =
        discipline?.appreciations?.map((chain) =>
            base64Handler.decode(chain)
        )[0] /* atention if too many users report less appreciations ! */ ||
        undefined;

    const obj = {
        code: discipline.codeMatiere,
        libelle: discipline.discipline,
        averageDatas: {
            classAverage: parseNumber(discipline.moyenneClasse),
            minAverage: parseNumber(discipline.moyenneMin),
            maxAverage: parseNumber(discipline.moyenneMax),
            userAverage: null,
        },
        coef: discipline.coef,
        isDisciplineGroup: discipline.groupeMatiere,
        workforce: discipline.effectif,
        rank: discipline.rang,
        teachers: teachersWithoutId,
        classAssessment: decodedClassAssessment,
        userAssessment: decodedUserAssessment,
    };

    return obj;
}

function formatGrade(grade, periodCode) {
    const {
        codeMatiere,
        codePeriode,
        devoir,
        libelleMatiere,
        date,
        coef,
        noteSur,
        valeur,
        nonSignificatif,
        moyenneClasse,
        minClasse,
        maxClasse,
        elementsProgramme,
        typeDevoir,
    } = grade;

    return {
        libelle: devoir,
        notSignificant: nonSignificatif,
        date,
        isExam: codePeriode.includes("X"),
        homeworkType: typeDevoir,
        disciplineName: libelleMatiere,
        codes: {
            period: codePeriode,
            discipline: codeMatiere,
        },
        data: {
            coef: parseFloat(coef),
            classAverage: parseNumber(moyenneClasse),
            outOf: parseNumber(noteSur),
            classMax: parseNumber(maxClasse),
            classMin: parseNumber(minClasse),
            grade: parseNumber(valeur),
        },
        skills: elementsProgramme.map(
            ({ descriptif, valeur, libelleCompetence }) => ({
                name: libelleCompetence,
                description: descriptif,
                value: skillColorsCodes[String(valeur)] || null,
            })
        ),
        onlySkills:
            (valeur == null || valeur === undefined) && elementsProgramme.length > 0,

        actionOnStreak: undefined,
        badges: [],
    };
}

function getGradesForDiscipline({ periodCode, disciplineCode }, rawGrades) {
    return rawGrades.filter(
        ({ codePeriode, codeMatiere }) =>
            codePeriode.includes(periodCode) && codeMatiere === disciplineCode
    );
}

function enrichDiscipline(discipline, periodCode, rawGrades) {
    const gradesList = getGradesForDiscipline(
        { disciplineCode: discipline.code, periodCode },
        rawGrades
    );

    const formattedGrades = gradesList.map((grade) =>
        formatGrade(grade, periodCode)
    );

    const enrichedDiscipline = {
        ...discipline,
        grades: formattedGrades,
        averageDatas: {
            ...discipline.averageDatas,
        },
    };

    enrichedDiscipline.averageDatas.userAverage = new Discipline(
        enrichedDiscipline
    ).getWeightedAverage();
    return enrichedDiscipline;
}

function streakDataInjectedIntoGrades(userGrades) {
    const result = JSON.parse(JSON.stringify(userGrades));
    Object.entries(result).forEach(([periodKey, periodData]) => {
        const gradesSortedByDate = sortGradesByDate(
            createValidGradesArray(result, periodKey)
        );
        const streak = calculateStreak(gradesSortedByDate, periodKey, result);
        periodData.globalStreakScore = streak.globalStreakScore;
        const periodStreakScores = streak.streakScores?.[periodKey] || {};

        const periodDisciplines = periodData.groups.flatMap((group) =>
            group.isDisciplineGroup ? group.disciplines : [group]
        );

        periodDisciplines.forEach((discipline) => {
            discipline.streakCount = periodStreakScores[discipline.code] || 0;
        });

        streak.gradesItered.forEach((gradeData) => {
            const discipline = periodDisciplines.find(
                ({ code }) => code === gradeData.codes.discipline
            );
            if (!discipline) return;
            const gradeToUpdate = discipline.grades.find((g) =>
                deepEqualExcept(g, gradeData, ["actionOnStreak"])
            );
            if (gradeToUpdate) {
                gradeToUpdate.actionOnStreak = gradeData.actionOnStreak;
            }
        });
    });

    return badgesDataInjectedIntoGrades(result);
}

function badgesDataInjectedIntoGrades(userGrades) {
    const result = JSON.parse(JSON.stringify(userGrades)); // deep copy

    Object.values(result).forEach((periodData) => {
        const periodDisciplines = periodData.groups.flatMap((group) =>
            group.isDisciplineGroup ? group.disciplines : [group]
        );

        periodDisciplines.forEach((discipline) => {
            const currentDisciplineAverage = discipline.averageDatas.userAverage;

            discipline.grades.forEach((gradeObj) => {
                const { classAverage, classMax, outOf, grade } =
                    gradeObj?.data || {};
                const badges = [];
                if (!grade) return;

                if (gradeObj.actionOnStreak === "up") badges.push("up_the_streak");
                if (grade === outOf) badges.push("max_grade");
                if (grade === classMax) badges.push("best_grade");
                if (grade > classAverage) badges.push("upper_than_class_average");
                if (currentDisciplineAverage && grade > currentDisciplineAverage)
                    badges.push("upper_than_discipline_average");
                if (grade === currentDisciplineAverage)
                    badges.push("equal_to_discipline_average");

                gradeObj.badges = badges;
            });
        });
    });
    return result;
}

