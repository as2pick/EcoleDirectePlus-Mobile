import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const SplashScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bienvenue</Text>
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
    title: {
        fontSize: 24,
        color: "#fff",
        fontWeight: "bold",
        marginBottom: 20,
    },
});

export default SplashScreen;

