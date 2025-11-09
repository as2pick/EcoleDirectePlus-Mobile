import { ActivityIndicator, StyleSheet, View } from "react-native";
import Text from "../../components/Ui/core/Text";

const SplashScreen = () => {
    return (
        <View style={styles.container}>
            <Text preset="h2">Bienvenue</Text>
            <ActivityIndicator size="large" color="#fff" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1E90FF",
    },
});

export default SplashScreen;

