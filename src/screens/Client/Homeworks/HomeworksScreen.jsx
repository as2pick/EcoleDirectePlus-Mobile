import React from "react";
import { SafeAreaView, Text } from "react-native";
export default function HomeworksScreen({ theme }) {
    return (
        <SafeAreaView>
            <Text style={{ color: theme.colors.text }}>
                This is the homeworks Page !
            </Text>
        </SafeAreaView>
    );
}

