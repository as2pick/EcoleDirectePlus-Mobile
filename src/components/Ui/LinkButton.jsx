import React from "react";
import { Linking, TouchableOpacity } from "react-native";

export default function LinkButton({ url, styles, children }) {
    const openURL = () => {
        Linking.openURL(url).catch((err) =>
            console.error("Erreur lors de l'ouverture du lien :", err)
        );
    };

    return (
        <TouchableOpacity style={styles} onPress={openURL}>
            {children}
        </TouchableOpacity>
    );
}

