import { useTheme } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";
import { CONFIG } from "../../constants/config";
import { addOpacityToCssRgb } from "../../utils/colorGenerator";
import LinkText from "./LinkText";

export default function InDev({}) {
    const { colors } = useTheme();

    const mainColor = addOpacityToCssRgb(colors.main, 0.5);
    return (
        <View style={[styles.parent]}>
            <View style={[styles.children, {backgroundColor: colors.case,}]}>
                <Text
                    style={[
                        styles.text,
                        {
                            color: mainColor,
                        },
                    ]}
                >
                    Fonctionnalité en cours de développement...
                </Text>
                <Text style={[styles.text, { color: mainColor }]}>
                    Rejoignez le{" "}
                    <LinkText
                        href={CONFIG.discordInviteLink}
                        styles={[styles.link, { color: mainColor }]}
                    >
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
        marginHorizontal: "4%",
        //backgroundColor: "red",
    },
    children: {
        //borderWidth: 2,
        borderRadius: 18,
        height: "27%",
        padding: 20,
        justifyContent: "center",
        //boxShadow: "5px 5px 9px rgba(0, 0, 0, 0.25)",
        boxShadow: "2px 2px 15px 3px rgba(0, 0, 0, 0.14)",
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    text: {
        fontSize: 18,
        textAlign: "center",
    },
    link: {
        textDecorationLine: "underline",
    },
});

