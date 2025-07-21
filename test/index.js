const { parseNumber } = require("../src/utils/grades/makeAverage");
const jsonData = require("./json2.json");

class Grade {
    constructor({
        libelle,
        notSignificant,
        date,
        homeworkType,
        disciplineName,
        codes,
        data,
        skills,
        onlySkills,
        isExam,
    }) {
        this.libelle = libelle;
        this.notSignificant = notSignificant;
        this.date = date;
        this.homeworkType = homeworkType;
        this.disciplineName = disciplineName;
        this.codes = codes;
        this.data = data;
        this.skills = skills;
        this.onlySkills = onlySkills;
        this.isExam = isExam;
        this.actionOnStreak = "nothing";
    }

    getGrade() {
        return {
            libelle: this.libelle,
            notSignificant: this.notSignificant,
            date: this.date,
            homeworkType: this.homeworkType,
            disciplineName: this.disciplineName,
            codes: this.codes,
            data: this.data,
            skills: this.skills,
            onlySkills: this.onlySkills,
            isExam: this.isExam == undefined ? false : this.isExam,
            actionOnStreak: this.actionOnStreak,
        };
    }
}

class Discipline {
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

class Period {
    constructor({ groups }, periodCode) {
        this.groups = groups;
        this.periodCode = periodCode;
    }
    makeGeneralAverage() {
        // get all disciplines from all groups (in one array)
        const disciplines = this.groups.flatMap((group) =>
            group.isDisciplineGroup ? group.disciplines : [group]
        );
        // use acuumulator to add averages and coef in one var - is like a loop
        const { total, totalCoef } = disciplines.reduce(
            (acc, discipline) => {
                const disciplineObj = new Discipline(discipline);
                const average = disciplineObj.getWeightedAverage();
                const coef = disciplineObj.getTotalCoef();

                if (!isNaN(average) && !isNaN(coef) && coef > 0) {
                    acc.total += average * coef;
                    acc.totalCoef += coef;
                }

                return acc;
            },
            { total: 0, totalCoef: 0 }
        );

        const average = totalCoef === 0 ? null : total / totalCoef;

        return parseNumber(average);
    }

    makeDisciplineAverage(disciplineCode) {
        let disciplineSearched = null;

        // 1. search discipline
        for (const group of this.groups) {
            const disciplines = group.isDisciplineGroup
                ? group.disciplines
                : this.groups;

            const found = disciplines.find((d) => d.code === disciplineCode);
            if (found) {
                disciplineSearched = found;
                break;
            }
        }

        // 2.check if discipline was founded
        if (!disciplineSearched) {
            // here there's not discipline found
            return null; // ou throw Error / return 0 / return 'N/A'
        }

        // 3. calculate weighted average
        const discipline = new Discipline(disciplineSearched);
        return discipline.getWeightedAverage();
    }

    createReferentialStreakScore() {
        const ref = {};
        const disciplines = this.groups.flatMap((group) =>
            group.isDisciplineGroup ? group.disciplines : [group]
        );
        ref[this.periodCode] = {};

        disciplines.forEach(({ code }) => {
            ref[this.periodCode][code] = 0;
        });

        return ref;
    }

    getPeriodDatas() {
        let infos = {
            numberOfGroups: 0,
            numberOfDisciplines: 0,
        };
        this.groups.forEach((group) => {
            if (group.isDisciplineGroup) {
                infos.numberOfGroups++;
                infos.numberOfDisciplines += group.disciplines.length;
            } else {
                infos.numberOfDisciplines += group.length;
            }
        });

        return {
            periodCode: this.periodCode,
            generalAverage: this.makeGeneralAverage(),
            ...infos,
        };
    }
}
const createValidGradesArray = (gradesData, periodCode) => {
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
const calculateWeightedAverageFromArray = (grades, disciplineCode = null) => {
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

function sortGradesByDate(grades) {
    return grades
        .filter((grade) => grade.date)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
}

const calculateStreak = (gradesArrayChronologicaly, periodCode) => {
    const periodObj = new Period(jsonData[periodCode], periodCode);
    let gradesItered = [];
    let streakScores = periodObj.createReferentialStreakScore();
    let globalStreakScore = 0;

    for (const grade of gradesArrayChronologicaly) {
        const gradeObj = new Grade(grade);

        if (gradesItered.length === 0) {
            gradeObj.actionOnStreak = gradeObj.data.grade >= 10 ? "up" : "nothing";

            if (gradeObj.actionOnStreak === "up") {
                streakScores[periodCode][gradeObj.codes.discipline] += 1;
                globalStreakScore += 1;
            }

            gradesItered.push(gradeObj);
            continue;
        }

        const quantityOfGradesInDiscipline = gradesItered.filter(
            (g) => g.codes.discipline === gradeObj.codes.discipline
        ).length;

        const oldGeneralAverage = calculateWeightedAverageFromArray(gradesItered);
        const oldDisciplineAverage = calculateWeightedAverageFromArray(
            gradesItered,
            gradeObj.codes.discipline
        );

        gradesItered.push(gradeObj);

        const newDisciplineAverage = calculateWeightedAverageFromArray(
            gradesItered,
            gradeObj.codes.discipline
        );

        if (quantityOfGradesInDiscipline === 0) {
            if (newDisciplineAverage > oldGeneralAverage) {
                gradeObj.actionOnStreak = "up";
                streakScores[periodCode][gradeObj.codes.discipline] += 1;
                globalStreakScore += 1;
            } else {
                gradeObj.actionOnStreak = "nothing";
            }
            continue;
        }

        if (newDisciplineAverage > oldDisciplineAverage) {
            gradeObj.actionOnStreak = "up";
            streakScores[periodCode][gradeObj.codes.discipline] += 1;
            globalStreakScore += 1;
        } else {
            gradeObj.actionOnStreak = "nothing";
            globalStreakScore -= streakScores[periodCode][gradeObj.codes.discipline];
            streakScores[periodCode][gradeObj.codes.discipline] = 0;

            for (let g of gradesItered.filter(
                (g) => g.codes.discipline === gradeObj.codes.discipline
            )) {
                if (g.actionOnStreak === "up") g.actionOnStreak = "previous up";
            }
        }
    }

    console.log(streakScores);
    console.log(gradesItered);

    return {
        streakScores,
        globalStreakScore,
        gradesItered,
    };
};

// Exemple d'appel :

Object.keys(jsonData).map((key) => {
    const a = new Period(jsonData[key], key);
    calculateStreak(sortGradesByDate(createValidGradesArray(jsonData, key)), key);
    console.log(a.makeGeneralAverage());
});

/*

const {
    calculateGlobalStreak,
    calculateWeightedAverage,
} = require("../src/utils/grades/makeAverage");

const grades = jsonData.data;

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
        inAttributedPeriod: codePeriode !== periodCode,
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

    const streak = calculateGlobalStreak(formattedGrades).streak;

    const validGrades = formattedGrades.filter(
        (g) => g.data.grade != null && !g.onlySkills
    );

    const average =
        validGrades.length > 0 ? calculateWeightedAverage(validGrades) : null;

    return {
        ...discipline,
        grades: formattedGrades,
        averageDatas: {
            ...discipline.averageDatas,
            userAverage: average,
        },
        streak,
    };
}

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
        periodStreak: 0,
    };

    return acc;
}, {});

// Enrich disciplines with grades, averages, streaks
for (const [periodCode, periodData] of Object.entries(periodsObj)) {
    let totalStreak = 0;

    periodData.groups = periodData.groups.map((group) => {
        if (group.isDisciplineGroup) {
            group.disciplines = group.disciplines.map((discipline) => {
                const enriched = enrichDiscipline(
                    discipline,
                    periodCode,
                    grades.notes
                );
                totalStreak += enriched.streak;
                return enriched;
            });
            return group;
        } else {
            const enriched = enrichDiscipline(group, periodCode, grades.notes);
            totalStreak += enriched.streak;
            return enriched;
        }
    });

    periodData.periodStreak = totalStreak;
}

// Display result
console.dir(periodsObj, { depth: null, colors: true });

*/

