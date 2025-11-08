import { useTheme } from "@react-navigation/native";
import { useMemo } from "react";
import { Text as RNText } from "react-native";

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
    thin: "100",
    "extra-light": "200",
    light: "300",
    normal: "400",
    medium: "500",
    "semi-bold": "600",
    bold: "700",
    "extra-bold": "800",
};

export default function Text({
    color: colorProp,
    size = 14,
    decoration,
    oneLine,
    align = "left",
    collapsable: collapsable,
    selectable,
    weight = "normal",
    children,
    style: styleProp,
    ...props
}) {
    const theme = useTheme();
    const { colors } = theme;
    const color = colorProp || colors.txt.txt1;

    const cacheKey = useMemo(() => {
        const key = [
            color,
            size,
            decoration,
            align,
            oneLine ? "oneLine" : "",
            collapsable ? "collapsable" : "",
            selectable ? "selectable" : "",
            !isNaN(Number(weight)) ? weight : FONT_WEIGHT_MAP[weight],
        ]
            .filter(Boolean)
            .join("-");
        return key;
    }, [color, size, decoration, align, oneLine, collapsable, selectable, weight]);

    const computedStyle = useMemo(() => {
        const cached = TEXT_STYLE_CACHE.get(cacheKey);
        if (cached) {
            return cached;
        }

        const dynamicStyle = {
            color,
            fontSize: size,
            fontWeight: !isNaN(Number(weight)) ? weight : FONT_WEIGHT_MAP[weight],
            textAlign: align,
            textDecorationLine: decoration,
            includeFontPadding: false,
        };

        TEXT_STYLE_CACHE.set(cacheKey, dynamicStyle);
        cleanupCache();

        return dynamicStyle;
    }, [cacheKey]);

    return (
        <RNText
            style={[computedStyle, styleProp]}
            numberOfLines={oneLine ? 1 : undefined}
            ellipsizeMode={oneLine ? "tail" : undefined}
            selectable={selectable}
            {...props}
        >
            {children}
        </RNText>
    );
}

