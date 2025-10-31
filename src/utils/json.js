import _ from "lodash";

/**
 * Checks if a string is a valid JSON object and can be parsed.
 * @param {string} value - The JSON string to test.
 * @returns {boolean} - Returns true if the string is a valid JSON object, false otherwise.
 */
export function isParsableJson(value) {
    try {
        const parsedValue = JSON.parse(value);
        return typeof parsedValue === "object" && parsedValue !== null;
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
    return arr1.every((val, index) => {
        const val2 = arr2[index];
        if (_.isPlainObject(val) && _.isPlainObject(val2)) {
            return objectsEqual(val, val2); // Comparaison récursive pour les objets
        } else if (Array.isArray(val) && Array.isArray(val2)) {
            return arraysEqual(val, val2); // Comparaison récursive pour les tableaux
        } else {
            return val === val2; // Comparaison directe pour les types primitifs
        }
    });
}

export function deepCopyObject(objToCopy) {
    return _.cloneDeep(objToCopy);
}

export function recusiveMerge(obj1, obj2) {
    return _.merge({}, obj1, obj2);
}

