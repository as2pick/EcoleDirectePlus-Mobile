import { Button } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { SafeAreaView } from "react-native";
import * as Keychain from "react-native-keychain";
import { Title } from "../../../components";

export default function HomeScreen() {
    const navigation = useNavigation();
    return (
        <SafeAreaView>
            <Title>This is the home Page !</Title>
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

