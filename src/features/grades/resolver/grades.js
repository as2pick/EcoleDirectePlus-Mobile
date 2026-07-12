import { useColorStore } from "@/hooks/useColorStore";
import Discipline from "../models/Discipline";
import { parseNumber } from "../utils/averages";
import { streakDataInjectedIntoGrades } from "../utils/streaks";
import fetchApi from "@/services/fetchApi";
import base64Handler from "@/utils/handleBase64";

const skillColorsCodes = {
    1: "red",
    2: "orange",
    3: "paleGreen",
    4: "green",
};

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
        if (gradesResponse.isDataEmpty) {
            return {};
        }
        const grades = gradesResponse.data;
        const periodsObj = grades.periodes.reduce((acc, period) => {
            if (period.annuel) return acc;

            const groups = [];
            let currentGroup = null;

            for (const disciplineRaw of period.ensembleMatieres.disciplines) {
                const discipline = parseDiscipline(disciplineRaw);

                if (discipline.isDisciplineGroup) {
                    delete discipline.code;
                    currentGroup = {
                        disciplines: [],
                        isDisciplineGroup: true,
                        name: discipline.libelle,
                    };
                    groups.push(currentGroup);
                    continue;
                }

                if (disciplineRaw.sousMatiere) {
                    if (currentGroup) {
                        currentGroup.disciplines.push(discipline);
                    }
                    continue;
                }

                currentGroup = null;
                groups.push(discipline);
            }

            acc[period.codePeriode] = {
                globalStreakScore: null,
                groups,
                periodName: period.periode,
            };
            return acc;
        }, {});

        const rawNotes = grades.notes;

        Object.entries(periodsObj).forEach(([periodCode, periodData]) => {
            periodData.groups.forEach((group, indexGroup) => {
                if (group.isDisciplineGroup) {
                    group.disciplines.forEach((discipline, indexDiscipline) => {
                        const enriched = enrichDiscipline(
                            discipline,
                            periodCode,
                            rawNotes
                        );
                        periodsObj[periodCode].groups[indexGroup].disciplines[
                            indexDiscipline
                        ] = enriched;
                    });
                } else {
                    const enriched = enrichDiscipline(group, periodCode, rawNotes);
                    periodsObj[periodCode].groups[indexGroup] = enriched;
                }
            });
        });

        const result = streakDataInjectedIntoGrades(periodsObj);

        const rawLastGrades = getLatestGrades(grades.notes, 10);
        const lastGrades = rawLastGrades.map((grade) => {
            const periodCode = grade.codes.period;
            const disciplineCode = grade.codes.discipline;
            const period = result[periodCode];
            let disciplineData = null;

            if (period?.groups) {
                for (const group of period.groups) {
                    if (group.isDisciplineGroup) {
                        const found = group.disciplines.find(
                            (d) => d.code === disciplineCode
                        );
                        if (found) {
                            disciplineData = found;
                            break;
                        }
                    } else if (group.code === disciplineCode) {
                        disciplineData = group;
                        break;
                    }
                }
            }

            return {
                ...grade,
                disciplineData,
            };
        });

        Object.defineProperty(result, "lastGrades", {
            value: lastGrades,
            enumerable: false,
            writable: true,
            configurable: true,
        });

        return result;
    } catch (e) {
        console.log("Error inside grades resolver : ", e);
        throw e;
    }
}

function parseDiscipline(discipline) {
    const teachersWithoutId = discipline.professeurs.map(({ nom }) => nom);
    let decodedClassAssessment =
        discipline?.appreciations?.map((chain) =>
            base64Handler.decode(chain)
        )[1] /* atention if too many users report less appreciations ! */ ||
        undefined;

    let decodedUserAssessment =
        discipline?.appreciations?.map((chain) =>
            base64Handler.decode(chain)
        )[0] /* atention if too many users report less appreciations ! */ ||
        undefined;

    const obj = {
        code: discipline.codeMatiere,
        libelle: discipline.discipline,
        color: useColorStore.getState().getOrAssignColor(discipline.codeMatiere),
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

export function getLatestGrades(rawNotes, limit = 5) {
    if (!Array.isArray(rawNotes)) return [];

    return rawNotes
        .filter((note) => note.date)
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, limit)
        .map((note) => {
            const formatted = formatGrade(note, note.codePeriode);
            formatted.disciplineColor = useColorStore
                .getState()
                .getOrAssignColor(note.codeMatiere);
            return formatted;
        });
}

