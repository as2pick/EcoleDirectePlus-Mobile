export function parseNumber(value) {
    if (typeof value === "number") {
        if (isNaN(value)) return null;
        return Math.round(value * 100) / 100;
    }
    if (typeof value === "string") {
        const parsed = parseFloat(value.replace(",", "."));
        if (isNaN(parsed)) return null;
        return Math.round(parsed * 100) / 100;
    }
    return null;
}
