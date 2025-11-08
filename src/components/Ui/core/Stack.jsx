import { useTheme } from "@react-navigation/native";
import { Component, useMemo } from "react";
import { View as RNView, StyleSheet } from "react-native";

const VIEW_STYLE_CACHE = new Map();
const MAX_CACHE_SIZE = 100;

const cleanupCache = () => {
    if (VIEW_STYLE_CACHE.size > MAX_CACHE_SIZE) {
        const entries = Array.from(VIEW_STYLE_CACHE.entries());
        VIEW_STYLE_CACHE.clear();
        entries.slice(-50).forEach(([key, value]) => {
            VIEW_STYLE_CACHE.set(key, value);
        });
    }
};

const ALIGN_ITEMS_MAP = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
};

const JUSTIFY_CONTENT_MAP = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
};

const DEFAULT_STYLES = StyleSheet.create({
    base: {
        width: "100%",
    },
    vertical: {
        width: "100%",
        flexDirection: "column",
    },
    horizontal: {
        width: "100%",
        flexDirection: "row",
    },
});

/**
 * @param {Object} props
 * @param {"vertical" | "horizontal"} props.orientation
 * @param {number} [props.gap=3]
 * @param {number | number[]} [props.padding=0]
 * @param {number | number[]} [props.margin=0]
 * @param {number} [props.borderRadius=0]
 * @param {string} props.bgColor
 * @param {"start" | "center" | "end"} props.alignVertical
 * @param {"start" | "center" | "end"} props.alignHorizontal
 * @param {object} props.style
 * @param {Component} props.children
 */

export default function Stack({
    orientation = "vertical",
    gap = 3,
    padding = 0,
    margin = 0,
    borderRadius = 0,
    bgColor: backgroundColor,
    alignVertical = "start",
    alignHorizontal = "start",
    style,
    children,
    ...props
}) {
    const theme = useTheme();

    const cacheKey = useMemo(() => {
        const key = [
            orientation,
            gap,
            padding,
            margin,
            borderRadius,
            backgroundColor || "",
            alignVertical,
            alignHorizontal,
        ]
            .filter(Boolean)
            .join("-");
        return key;
    }, [
        orientation,
        gap,
        padding,
        margin,
        borderRadius,
        backgroundColor,
        alignVertical,
        alignHorizontal,
    ]);

    const computedStyle = useMemo(() => {
        const cached = VIEW_STYLE_CACHE.get(cacheKey);
        if (cached) {
            return cached;
        }

        const baseStyle =
            orientation === "vertical"
                ? DEFAULT_STYLES.vertical
                : DEFAULT_STYLES.horizontal;

        const isValidPaddingArray = Array.isArray(padding) && padding.length === 4;
        const isValidMarginArray = Array.isArray(margin) && margin.length === 4;
        const isValidRadiusArray =
            Array.isArray(borderRadius) && borderRadius.length === 4;

        const dynamicStyle = {
            gap,
            padding: !(padding instanceof Array) ? padding : undefined,
            paddingTop: isValidPaddingArray ? padding[0] : undefined,
            paddingRight: isValidPaddingArray ? padding[1] : undefined,
            paddingBottom: isValidPaddingArray ? padding[2] : undefined,
            paddingLeft: isValidPaddingArray ? padding[3] : undefined,

            margin: !(margin instanceof Array) ? margin : undefined,
            marginTop: isValidMarginArray ? margin[0] : undefined,
            marginRight: isValidMarginArray ? margin[1] : undefined,
            marginBottom: isValidMarginArray ? margin[2] : undefined,
            marginLeft: isValidMarginArray ? margin[3] : undefined,

            borderRadius: !(borderRadius instanceof Array)
                ? borderRadius
                : undefined,
            borderTopLeftRadius: isValidRadiusArray ? borderRadius[0] : undefined,
            borderTopRightRadius: isValidRadiusArray ? borderRadius[1] : undefined,
            borderBottomLeftRadius: isValidRadiusArray ? borderRadius[2] : undefined,
            borderBottomRightRadius: isValidRadiusArray
                ? borderRadius[3]
                : undefined,

            alignItems: ALIGN_ITEMS_MAP[alignHorizontal],
            justifyContent: JUSTIFY_CONTENT_MAP[alignVertical],
            backgroundColor: backgroundColor,
        };

        const renderStyle = [baseStyle, dynamicStyle];

        VIEW_STYLE_CACHE.set(cacheKey, renderStyle);

        cleanupCache();

        return dynamicStyle;
    }, [cacheKey]);

    return (
        <RNView style={[computedStyle, style]} {...props}>
            {children}
        </RNView>
    );
}

