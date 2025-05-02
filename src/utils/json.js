export function isJsonObject(value) {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    try {
        JSON.stringify(value);
        return true;
    } catch (error) {
        return false;
    }
}

