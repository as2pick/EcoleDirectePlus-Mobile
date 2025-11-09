import { Linking } from "react-native";
import Text from "./core/Text";

export default function LinkText({ href, color, underline = false, children }) {
    const openURL = () => {
        Linking.openURL(href).catch((err) =>
            console.error("Erreur lors de l'ouverture du lien :", err)
        );
    };

    return (
        <Text
            color={color}
            onPress={openURL}
            preset="label1"
            decoration={underline ? "underline" : undefined}
        >
            {children}
        </Text>
    );
}

