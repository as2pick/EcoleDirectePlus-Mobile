import _ from "lodash";

/**
 * Checks if a string is a valid JSON object and can be parsed.
 * @param {string} value - The JSON string to test.
 * @returns {boolean} - Returns true if the string is a valid JSON object, false otherwise.
 */
export function isParsableJson(value) {
    try {
        const parsedValue = JSON.parse(value);

        return _.isPlainObject(parsedValue);
    } catch (error) {
        return false;
    }
}

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

