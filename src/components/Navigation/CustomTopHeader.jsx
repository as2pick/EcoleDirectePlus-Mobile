import { useNavigation, useTheme } from "@react-navigation/native";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackArrow from "../../../assets/svg/BackArrow";
import Title from "../Ui/Title";

export default function CustomTopHeader({
    headerTitle,
    backArrow = { size: 24 },
    height = 70,
    backgroundColor = "hsla(0,0%, 0%, 0%)",
    maxWidth = "100%",
}) {
    const navigation = useNavigation();
    const { colors } = useTheme();

    const handleGoBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    };

    return (
        <SafeAreaView style={{ backgroundColor }}>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleGoBack}
                style={[styles.header, { height }]}
            >
                <View style={styles.leftContainer}>
                    <BackArrow fill={backArrow.color} size={backArrow.size} />
                </View>

                <View style={styles.centerContainer}>
                    <Title
                        style={[styles.title, { maxWidth }]}
                        color={colors.contrast}
                        preset="h4"
                    >
                        {headerTitle}
                    </Title>
                </View>

                <View style={styles.rightContainer} />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: "5%",
        width: "100%",
    },
    leftContainer: {
        justifyContent: "center",
        alignItems: "flex-start",
    },
    centerContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    rightContainer: {
        justifyContent: "center",
        alignItems: "flex-end",
    },
    title: {
        textAlign: "center",
    },
});

