import { useTheme } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";
import { CONFIG } from "../../constants/config";
import { addOpacityToCssRgb } from "../../utils/colorGenerator";
import LinkText from "./LinkText";

export default function InDev({}) {
    const { colors } = useTheme();
    const mainColor = addOpacityToCssRgb(colors.txt.txt3, 0.5);
    return (
        <View style={[styles.parent]}>
            <View style={[styles.children, { borderColor: mainColor }]}>
                <Text style={[styles.text, { color: mainColor }]}>
                    Fonctionnalité en cours de développement...
                </Text>
                <Text style={[styles.text, { color: mainColor }]}>
                    Rejoignez le{" "}
                    <LinkText href={CONFIG.discordInviteLink} styles={styles.link}>
                        serveur Discord d'EDP
                    </LinkText>{" "}
                    pour en suivre l'avancée !
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    parent: {
        height: "100%",
        alignItems: "center",
        // justifyContent: "center",
        marginHorizontal: "2%",
        top: "7%",
    },
    children: {
        borderWidth: 2,
        borderRadius: 20,
        height: "27%",
        padding: 20,
        justifyContent: "center",
    },
    text: {
        fontSize: 18,
        textAlign: "center",
    },
    link: {
        textDecorationLine: "underline",
    },
});

