import fetchApi from "../services/fetchApi";

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

        const periodDetails = grades.periodes.reduce(
            (acc, { periode, idPeriode, ensembleMatieres }) => {
                const disciplines = getDisciplinesForPeriod(ensembleMatieres);

                disciplines.forEach((discipline) => {
                    const disciplineGrades = getGradesForDiscipline(
                        grades.notes,
                        idPeriode
                    ).filter(
                        (grade) => grade.disciplineName === discipline.discipline
                    );

                    discipline.grades = disciplineGrades;
                });

                acc.push({
                    name: periode,
                    id: idPeriode,
                    disciplines,
                    generalAverage: ensembleMatieres.moyenneGenerale,
                    maxAverage: ensembleMatieres.moyenneMax,
                    minAverage: ensembleMatieres.moyenneMin,
                    classAverage: ensembleMatieres.moyenneClasse,
                });
                return acc;
            },
            []
        );

        return periodDetails;
    } catch (error) {
        console.error("Error fetching grades:", error);
        throw error;
    }
}

const getDisciplinesForPeriod = (period) => {
    const { disciplines } = period;

    return disciplines
        .filter(({ groupeMatiere }) => !groupeMatiere)
        .map(
            ({
                discipline,
                moyenne,
                moyenneClasse,
                moyenneMin,
                moyenneMax,
                coef,
            }) => ({
                discipline,
                average: moyenne,
                classAverage: moyenneClasse,
                minAverage: moyenneMin,
                maxAverage: moyenneMax,
                coef,
            })
        );
};

const getGradesForDiscipline = (grades, periodId) => {
    return grades
        .filter(({ codePeriode }) => codePeriode === periodId)
        .map(
            ({
                devoir,
                libelleMatiere,
                date,
                dateSaisie,
                coef,
                noteSur,
                valeur,
                nonSignificatif,
                moyenneClasse,
                minClasse,
                maxClasse,
                elementsProgramme,
            }) => ({
                assignment: devoir,
                disciplineName: libelleMatiere,
                dateEntered: dateSaisie,
                isOptional: nonSignificatif,
                gradeDetails: {
                    denominator: noteSur,
                    coef,
                    date,
                    studentGrade: valeur,
                    classAverage: moyenneClasse,
                    classMax: maxClasse,
                    classMin: minClasse,
                },
                academicSkills: elementsProgramme
                    ? elementsProgramme.map(
                          ({ descriptif, valeur, libelleCompetence }) => ({
                              description: descriptif,
                              skillName: libelleCompetence,
                              value: valeur,
                          })
                      )
                    : [],
            })
        );
};

