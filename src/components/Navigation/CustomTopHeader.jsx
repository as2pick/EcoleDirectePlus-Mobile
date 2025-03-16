import { useNavigation, useTheme } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackArrow from "../../assets/svg/BackArrow";

export default function CustomTopHeader({
    headerTitle,
    backArrow = { color: "white", size: 24 },
}) {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const Title = ({ customStyle = {}, children }) => {
        return (
            <Text style={[styles.title, customStyle, { color: colors.txt.txt1 }]}>
                {children}
            </Text>
        );
    };

    return (
        <SafeAreaView style={styles.header}>
            <TouchableOpacity
                style={styles.backArrow}
                onPress={() => navigation.goBack()}
            >
                <BackArrow fill={backArrow.color} size={backArrow.size} />
                <Title customStyle={styles.headerTitle}>{headerTitle}</Title>
            </TouchableOpacity>
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
        paddingVertical: 10,
        marginHorizontal: 20,
        position: "relative",
    },
    backArrow: {
        flexDirection: "row",
    },
});

