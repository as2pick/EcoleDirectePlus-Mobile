import React from "react";
import { StyleSheet, View } from "react-native";

export default function CentererComponent({
    horizontal = "center",
    vertical = "center",
    absolute = true,
    positioning = { top: 0, right: null, bottom: null, left: 0 },
    children,
}) {
    const { top, right, bottom, left } = positioning;
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            top,
            right,
            bottom,
            left,
            width: "100%",
            height: "100%",
            position: typeof absolute === "string" ? absolute : "relative",
            ...(horizontal && { alignItems: horizontal }),
            ...(vertical && { justifyContent: vertical }),
        },
    });

    return <View style={styles.container}>{children}</View>;
}

