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
        return Math.round(value * 100) / 100;
    }
    if (typeof value === "string") {
        return Math.round(parseFloat(value.replace(",", ".")) * 100) / 100;
    }
    return null;
}

