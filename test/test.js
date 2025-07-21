const { parseNumber } = require("../src/utils/grades/makeAverage");
const jsonData = require("./json.json");

const calculateStreakSimple = (gradesData) => {
    const chronologicalGradesSorted = chronologicalSort(gradesData, false);
    const streaks = {
        global: 0,
        subjects: {}, // matière -> streak
    };

    const subjectNotes = {}; // Pour accumuler les notes par matière

    for (const note of chronologicalGradesSorted) {
        const { codes, data, notSignificant, onlySkills } = note;
        if (
            !codes?.discipline ||
            notSignificant ||
            onlySkills ||
            !data?.grade ||
            !data?.outOf ||
            !data?.coef
        )
            continue;

        const subjectCode = codes.discipline;
        const grade = parseFloat(data.grade);
        const outOf = parseFloat(data.outOf);
        const coef = parseFloat(data.coef);

        // Initialise si pas encore de streak ni de liste
        if (!streaks.subjects[subjectCode]) {
            streaks.subjects[subjectCode] = 0;
        }
        if (!subjectNotes[subjectCode]) {
            subjectNotes[subjectCode] = [];
        }

        // Nouvelle note pondérée sur 20
        const normalized = (grade * 20) / outOf;

        // Moyenne actuelle
        const existingNotes = subjectNotes[subjectCode];
        const existingTotalCoef = existingNotes.reduce((sum, n) => sum + n.coef, 0);
        const existingWeightedSum = existingNotes.reduce(
            (sum, n) => sum + n.value,
            0
        );

        const currentAverage =
            existingTotalCoef > 0 ? existingWeightedSum / existingTotalCoef : 10; // Si aucune note, on considère que la moyenne est 10

        // Compare la nouvelle note à la moyenne
        const improves = normalized > currentAverage;

        // Ajoute la note dans la pile pour la suite
        subjectNotes[subjectCode].push({
            value: normalized * coef,
            coef,
        });

        if (improves) {
            streaks.subjects[subjectCode]++;
            streaks.global++;
            note.upTheStreak = true;
        } else {
            streaks.global -= streaks.subjects[subjectCode];
            streaks.subjects[subjectCode] = 0;

            // Optionnel : tu peux ici tag toutes les précédentes notes de la matière comme "maybe"
            for (const prevNote of existingNotes) {
                if (prevNote.upTheStreak === true) {
                    prevNote.upTheStreak = "maybe";
                }
            }

            note.upTheStreak = false;
        }
    }

    return streaks;
};

const streakResult = calculateStreakSimple(jsonData);
console.log("Streak globale :", streakResult.global);
console.log("Streaks par matière :", streakResult.subjects);

