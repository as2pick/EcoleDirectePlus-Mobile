export function calculateGlobalStreak(notes) {
    let cumulativeNumerator = 0;
    let cumulativeDenominator = 0;
    let streak = 0;
    const contributingNotes = [];
    const canceledContributors = [];

    for (const note of notes) {
        const { grade, outOf, coef, classAverage } = note.data;
        const normalizedGrade = (grade / outOf) * 20;
        const weightedGrade = normalizedGrade * coef;

        const currentAverage =
            cumulativeDenominator > 0
                ? cumulativeNumerator / cumulativeDenominator
                : null;

        const newNumerator = cumulativeNumerator + weightedGrade;
        const newDenominator = cumulativeDenominator + coef;
        const newAverage = newNumerator / newDenominator;

        let improvesGlobalAverage;
        if (currentAverage === null) {
            improvesGlobalAverage = normalizedGrade >= (classAverage * 20) / 20;
        } else {
            improvesGlobalAverage = newAverage > currentAverage;
        }

        if (improvesGlobalAverage) {
            streak++;
            contributingNotes.push(note);
        } else {
            if (streak > 0) {
                streak--;
                const removedNote = contributingNotes.pop();
                if (removedNote) canceledContributors.push(removedNote);
            }
        }

        cumulativeNumerator = newNumerator;
        cumulativeDenominator = newDenominator;
    }

    return {
        streak,
        contributingNotes,
        canceledContributors,
    };
}

export function calculateWeightedAverage(gradesArray) {
    let totalWeightedGrades = 0;
    let totalCoef = 0;

    for (const item of gradesArray) {
        const coef = parseFloat(item.data.coef);
        if (isNaN(coef)) continue;

        let grade = item.data.grade;
        const outOf = parseFloat(item.data.outOf);

        if (item.notSignificant && grade <= 10) continue; // <= or < idk

        if (isNaN(grade)) continue;

        if (outOf && outOf !== 20) {
            grade = (grade / outOf) * 20;
        }

        totalWeightedGrades += grade * coef;
        totalCoef += coef;
    }

    if (totalCoef === 0) return null;
    return (totalWeightedGrades / totalCoef).toFixed(2);
}

export function parseNumber(value) {
    if (typeof value === "number") {
        // C’est déjà un nombre
        return Math.round(value * 100) / 100;
    }
    if (typeof value === "string") {
        return Math.round(parseFloat(value.replace(",", ".")) * 100) / 100;
    }
    // Retourne null ou undefined si pas un nombre ou string
    return null;
}

