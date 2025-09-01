import { useTheme } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";

export default function GradientBackground({ children }) {
    const { colors } = useTheme();
    return (
        <LinearGradient
            colors={colors.background.gradient}
            start={{ x: 0, y: 0.45 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
        >
            {children}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
        position: "absolute",
        width: "100%",
        height: "100%",
    },
});

