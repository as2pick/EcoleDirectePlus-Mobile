import { useTheme } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";

export default function GradientBackground({ children }) {
    const { colors } = useTheme();
    return (
        <View
            style={[
                styles.gradient,
                { backgroundColor: colors.background.gradient },
            ]}
        >
            {children}
        </View>
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

