import React from "react";
import { SafeAreaView, Text } from "react-native";
export default function MessagingScreen({ theme }) {
    return (
        <SafeAreaView>
            <Text style={{ color: theme.colors.txt.txt1 }}>
                This is the messaging Page !
            </Text>
        </SafeAreaView>
    );
}

