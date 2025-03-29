import { useNavigation } from "@react-navigation/native";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackArrow from "../../../assets/svg/BackArrow";
import Title from "../UI/Title";

export default function CustomTopHeader({
    headerTitle,
    backArrow = { color: "white", size: 24 },
    height = 70,
    backgroundColor = "hsla(0,0%, 0%, 0%)",
}) {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={{ backgroundColor: backgroundColor }}>
            <View style={[styles.header, { height: height }]}>
                <TouchableOpacity
                    style={styles.backArrowContainer}
                    onPress={() => navigation.goBack()}
                >
                    <BackArrow fill={backArrow.color} size={backArrow.size} />

                    <Title customStyle={styles.title}>{headerTitle}</Title>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: 600,
        marginLeft: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "flex-start",

        paddingHorizontal: 20,
    },

    backArrowContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
});

