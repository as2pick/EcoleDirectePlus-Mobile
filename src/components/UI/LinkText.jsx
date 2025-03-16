import React from "react";
import { Linking, Text } from "react-native";

export default function LinkText({ url, styles, children }) {
    const openURL = () => {
        Linking.openURL(url).catch((err) =>
            console.error("Erreur lors de l'ouverture du lien :", err)
        );
    };

    return (
        <Text style={styles} onPress={openURL}>
            {children}
        </Text>
    );
}
