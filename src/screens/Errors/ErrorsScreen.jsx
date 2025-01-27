import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

const ErrorScreen = ({ error, resetError }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Une erreur est survenue</Text>
            <Text style={styles.message}>{error.message}</Text>
            <Text style={styles.details}>Détails de l'erreur : {error.details}</Text>
            <Button title="Réessayer" onPress={resetError} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    title: {
        fontSize: 24,
        color: "white",
        marginBottom: 20,
    },
    message: {
        fontSize: 18,
        color: "white",
        marginBottom: 10,
    },
    details: {
        fontSize: 14,
        color: "lightgray",
        marginBottom: 20,
    },
});

export default ErrorScreen;

