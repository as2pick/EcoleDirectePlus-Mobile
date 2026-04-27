import { sha256 } from "js-sha256";

const assertString = (text, functionName) => {
    if (typeof text !== "string") {
        throw new TypeError(
            `${functionName}: expected a string but received ${typeof text}`
        );
    }
};

export function textToHSL({
    text,
    salt = "",
    initialS = 43, // 42
    initialL = 73, // 73
    variationS = 10, // 10
    variationL = 10,
}) {
    // Provide safe default for undefined or empty text
    const safeText = typeof text === "string" && text.length > 0 ? text : "default";

    const int = parseInt(sha256(safeText + salt), 16);
    const l = int % 10000;
    const h = Math.round((int % 10 ** 8) / 10 ** 4);
    const s = Math.round((int % 10 ** 12) / 10 ** 8);
    return [
        Math.round(360 * (h / 9999)),
        Math.round(initialS + variationS * (s / 9999)),
        Math.round(initialL + variationL * (l / 9999)),
    ]; // [{0-360}, {70-100}, {40-70}]
}

export function hslToRgb(h, s, l) {
    h = h % 360;
    s = Math.max(0, Math.min(1, s));
    l = Math.max(0, Math.min(1, l));

    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    let m = l - c / 2;
    let r = 0,
        g = 0,
        b = 0;

    if (h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (h < 300) {
        r = x;
        g = 0;
        b = c;
    } else {
        r = c;
        g = 0;
        b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return [r, g, b];
}

export function rgbToHsl(r, g, b) {
    let h, s, l;

    r /= 255;
    g /= 255;
    b /= 255;

    let cmax = Math.max(r, g, b);
    let cmin = Math.min(r, g, b);
    let delta = cmax - cmin;

    l = (cmax + cmin) / 2;

    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    switch (cmax) {
        case r:
            h = 60 * (((g - b) / delta) % 6);
            break;
        case g:
            h = 60 * ((b - r) / delta + 2);
            break;
        case b:
            h = 60 * ((r - g) / delta + 4);
            break;
    }

    if (h < 0) h += 360;

    return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

export const cssRgbToRgb = (text) => {
    assertString(text, "cssRgbToRgb");
    const rgbMatch = text.match(/\d+/g);

    if (!rgbMatch || rgbMatch.length < 3) {
        throw new Error("cssRgbToRgb: invalid RGB string");
    }

    const [x, y, z] = rgbMatch;
    return [x, y, z];
};

export const cssRgbToHsl = (text) => {
    const [r, g, b] = cssRgbToRgb(text);
    const [h, s, l] = rgbToHsl(r, g, b);
    return [h, s, l];
};

export const cssHslaToHsla = (text) => {
    assertString(text, "cssHslaToHsla");
    const values = text.match(/[\d.]+%?/g);

    if (!values || values.length < 4) {
        throw new Error("cssHslaToHsla: invalid HSLA string");
    }

    const [h, s, l, a] = values.map((v) => parseFloat(v));
    return [h, s, l, a];
};

export const isDarkColor = (hsl) => {
    assertString(hsl, "isDarkColor");
    const match = hsl.match(/,\s*(\d+)%\)$/);

    if (!match) {
        throw new Error("isDarkColor: invalid HSL string");
    }

    const lightness = parseFloat(match[1]);
    return lightness < 50;
};

export const addOpacityToCssRgb = (text, a) => {
    if (a > 1) return "rgb(255, 100, 20)";

    const opacity =
        typeof a === "number" && !Number.isNaN(a) ? Math.max(0, Math.min(1, a)) : 1;
    if (typeof text !== "string") {
        return `rgba(0, 0, 0, ${opacity})`;
    }

    const rgbMatch = text.match(/\d+/g);
    if (!rgbMatch || rgbMatch.length < 3) {
        return `rgba(0, 0, 0, ${opacity})`;
    }

    const [r, g, b] = rgbMatch;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const adjustLightness = (hslString, amount) => {
    assertString(hslString, "adjustLightness");
    const match = hslString.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);

    if (!match) {
        throw new Error("adjustLightness: invalid HSL string format");
    }

    const h = parseInt(match[1], 10);
    const s = parseInt(match[2], 10);
    const l = parseInt(match[3], 10);

    const newL = Math.max(0, Math.min(100, l + amount));
    return `hsl(${h}, ${s}%, ${newL}%)`;
};

export const adjustSaturation = (hslString, amount) => {
    assertString(hslString, "adjustSaturation");
    const match = hslString.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);

    if (!match) {
        throw new Error("adjustSaturation: invalid HSL string format");
    }

    const h = parseInt(match[1], 10);
    const s = parseInt(match[2], 10);
    const l = parseInt(match[3], 10);

    const newS = Math.max(0, Math.min(100, s + amount));
    return `hsl(${h}, ${newS}%, ${l}%)`;
};
