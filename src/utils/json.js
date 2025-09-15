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

export function objectsEqual(obj1, obj2) {
    if (!_.isPlainObject(obj1) || !_.isPlainObject(obj2)) {
        return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    return keys1.every((key) => {
        const val1 = obj1[key];
        const val2 = obj2[key];

        if (_.isPlainObject(val1) && _.isPlainObject(val2)) {
            return objectsEqual(val1, val2);
        } else if (Array.isArray(val1) && Array.isArray(val2)) {
            return arraysEqual(val1, val2);
        } else {
            return val1 === val2;
        }
    });
}

export function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);
    return [...set1].every((value) => set2.has(value));
}

