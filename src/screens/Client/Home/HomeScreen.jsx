import { Button } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { SafeAreaView, Text } from "react-native";
import * as Keychain from "react-native-keychain";
export default function HomeScreen() {
    const navigation = useNavigation();
    return (
        <SafeAreaView>
            <Text>This is the home Page !</Text>
            <Button
                onPress={async () => {
                    await Keychain.resetGenericPassword();
                }}
            >
                CLICK HERE !
            </Button>
        </SafeAreaView>
    );
}

