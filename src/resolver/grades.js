import fetchApi from "../services/fetchApi";
import { parseNumber } from "../utils/grades/makeAverage";

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
            };

            return acc;
        }, {});

        // Enrich disciplines with grades, averages, streaks
        for (const [periodCode, periodData] of Object.entries(periodsObj)) {
            periodData.groups = periodData.groups.map((group) => {
                if (group.isDisciplineGroup) {
                    group.disciplines = group.disciplines.map((discipline) => {
                        const enriched = enrichDiscipline(
                            discipline,
                            periodCode,
                            grades.notes
                        );
                        return enriched;
                    });
                    return group;
                } else {
                    const enriched = enrichDiscipline(
                        group,
                        periodCode,
                        grades.notes
                    );
                    return enriched;
                }
            });
        }

        return periodsObj;
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

        actionOnStreak: null,
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

    return {
        ...discipline,
        grades: formattedGrades,
        averageDatas: {
            ...discipline.averageDatas,
        },
    };
}

