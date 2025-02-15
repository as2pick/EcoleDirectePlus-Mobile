import { sha256 } from "js-sha256";

export function textToHSL(
    str,
    salt = "",
    initialS = 42,
    initialL = 73,
    variationS = 10,
    variationL = 10
) {
    const int = parseInt(sha256(str + salt), 16);
    const l = int % 10000;
    const h = Math.round((int % 10 ** 8) / 10 ** 4);
    const s = Math.round((int % 10 ** 12) / 10 ** 8);
    return [
        Math.round(360 * (h / 9999)),
        Math.round(initialS + variationS * (s / 9999)),
        Math.round(initialL + variationL * (l / 9999)),
    ]; // [{0-360}, {70-100}, {40-70}]
}

