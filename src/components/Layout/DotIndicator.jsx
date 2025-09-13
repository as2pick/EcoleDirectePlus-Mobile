import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";

const { width } = Dimensions.get("window");

const data = [
    { id: "1", text: "Ta streak 11" },
    { id: "2", text: "Un autre élément" },
    { id: "3", text: "Encore un autre" },
];

export default function DotIndicator() {
    return (
        <View style={styles.container}>
            <Animated.ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
            >
                {data.map((item) => (
                    <View key={item.id} style={styles.card}>
                        <Text style={styles.text}>{item.text}</Text>
                    </View>
                ))}
            </Animated.ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    card: {
        width,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "orange",
    },
    text: { fontSize: 24, fontWeight: "bold", color: "white" },
});

