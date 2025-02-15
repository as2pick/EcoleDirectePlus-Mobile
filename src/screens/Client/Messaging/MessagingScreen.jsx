import React from "react";
import { SafeAreaView, Text } from "react-native";
export default function MessagingScreen({ theme }) {
    return (
        <SafeAreaView>
            <Text style={{ color: theme.colors.text }}>
                This is the messaging Page !
            </Text>
        </SafeAreaView>
    );
}

