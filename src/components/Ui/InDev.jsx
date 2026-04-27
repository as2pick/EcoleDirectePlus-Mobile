import { useTheme } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { CONFIG } from "../../constants/config";
import { addOpacity } from "../../utils/colorGenerator";
import LinkText from "./LinkText";
import Text from "./core/Text";

export default function InDev({ }) {
    const { colors } = useTheme();
    const mainColor = addOpacity(colors.contrast, 0.8);
    return (
        <View style={[styles.parent]}>
            <View
                style={[
                    styles.children,
                    {
                        backgroundColor: colors.secondary,
                    },
                ]}
            >
                <Text align="center" preset="body1" color={mainColor}>
                    Fonctionnalité en cours de développement...
                </Text>

                <Text align="center" preset="body1" color={mainColor}>
                    Rejoignez le{" "}
                    <LinkText href={CONFIG.discordInviteLink} color={mainColor}>
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
        marginHorizontal: "4%",
    },
    children: {
        borderRadius: 18,
        height: "27%",
        padding: 20,
        justifyContent: "center",
    },
});

