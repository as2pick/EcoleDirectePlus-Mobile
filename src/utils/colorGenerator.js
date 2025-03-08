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
    let [x, y, z] = text.match(/\d+/g);

    return [x, y, z];
};

export const cssRgbToHsl = (text) => {
    const [r, g, b] = cssRgbToRgb(text);

    const [h, s, l] = rgbToHsl(r, g, b);
    return [h, s, l];
};

export const isDarkColor = (hsl) => {
    const lightness = parseFloat(hsl.match(/,\s*(\d+)%\)$/)[1]);
    return lightness < 50;
};

