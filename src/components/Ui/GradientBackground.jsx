import { useTheme } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";
import canardman from "../../../assets/json/lottie/canardman_walking.json";

export default function GradientBackground({ children }) {
    const { colors } = useTheme();
    const bg = colors.background.gradient;

    if (Array.isArray(bg)) {
        return (
            <LinearGradient colors={bg} style={styles.gradient} locations={[0, 0.35]}>
                {children}
            </LinearGradient>
        );
    }

    return (
        <View style={[styles.gradient, { backgroundColor: bg }]} />
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
        position: "absolute",
        width: "100%",
        height: "100%",
    }
});

