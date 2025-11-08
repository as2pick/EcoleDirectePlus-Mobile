import { useTheme } from "@react-navigation/native";
import { useMemo } from "react";
import { Text as RNText, StyleSheet } from "react-native";

const TEXT_STYLE_CACHE = new Map();
const MAX_CACHE_SIZE = 100;

const cleanupCache = () => {
    if (TEXT_STYLE_CACHE.size > MAX_CACHE_SIZE) {
        const entries = Array.from(TEXT_STYLE_CACHE.entries());
        TEXT_STYLE_CACHE.clear();
        entries.slice(-50).forEach(([key, value]) => {
            TEXT_STYLE_CACHE.set(key, value);
        });
    }
};

const FONT_WEIGHT_MAP = {
    light: "Lexend-Light",
    normal: "Lexend-Regular",
    medium: "Lexend-Medium",
    bold: "Lexend-Bold",
};

const PRESETS_VARIANTS = StyleSheet.create({
    label1: {
        fontSize: 14,
        fontFamily: FONT_WEIGHT_MAP.light,
    },
    label2: {
        fontSize: 20,
        fontFamily: FONT_WEIGHT_MAP.normal,
    },
    label3: {
        fontSize: 24,
        fontFamily: FONT_WEIGHT_MAP.normal,
    },
    title1: {
        fontSize: 16,
        fontFamily: FONT_WEIGHT_MAP.normal,
    },
    body1: {
        fontSize: 14,
        fontFamily: FONT_WEIGHT_MAP.light,
    },
});

export default function Text({
    preset = "label1",
    style: styleProp,
    color: colorProp,
    size,
    decoration,
    oneLine,
    align = "left",
    collapsable,
    selectable,
    weight,
    children,
    ...props
}) {
    const theme = useTheme();
    const { colors } = theme;

    const cacheKey = useMemo(() => {
        return [
            preset,
            colorProp || colors.txt.txt1,
            size || "",
            weight || "",
            align,
            decoration || "",
        ].join("-");
    }, [preset, colorProp, colors.txt.txt1, size, weight, align, decoration]);

    const computedStyle = useMemo(() => {
        const cached = TEXT_STYLE_CACHE.get(cacheKey);
        if (cached) {
            return cached;
        }

        const presetStyle = PRESETS_VARIANTS[preset] || {};
        const flattenedProp = StyleSheet.flatten(styleProp) || {};

        const dynamicStyle = {
            ...presetStyle,
            color: colorProp || flattenedProp.color || colors.txt.txt1,
            ...(size && { fontSize: size }),
            ...(weight && {
                fontFamily: !isNaN(Number(weight))
                    ? weight
                    : FONT_WEIGHT_MAP[weight],
            }),
            textAlign: align,
            ...(decoration && { textDecorationLine: decoration }),
            includeFontPadding: false,
        };

        const finalStyle = [dynamicStyle, flattenedProp];

        TEXT_STYLE_CACHE.set(cacheKey, finalStyle);
        cleanupCache();

        return finalStyle;
    }, [
        cacheKey,
        styleProp,
        colorProp,
        colors.txt.txt1,
        size,
        weight,
        align,
        decoration,
        preset,
    ]);

    return (
        <RNText
            style={computedStyle}
            numberOfLines={oneLine ? 1 : undefined}
            ellipsizeMode={oneLine ? "tail" : undefined}
            selectable={selectable}
            {...props}
        >
            {children}
        </RNText>
    );
}

