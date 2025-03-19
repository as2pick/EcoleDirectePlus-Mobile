import { Button } from "@react-navigation/elements";
import React from "react";
import * as Keychain from "react-native-keychain";
import { SafeAreaView } from "react-native-safe-area-context";
import InDev from "../../../components/UI/InDev";
import { useUser } from "../../../context/UserContext";

export default function HomeScreen() {
    const { setIsConnected } = useUser();
    return (
        <SafeAreaView>
            <Button
                onPress={async () => {
                    await Keychain.resetGenericPassword();
                    await setIsConnected(false);
                }}
            >
                Disconect and forget secrets
            </Button>
            <InDev />
        </SafeAreaView>
    );
}

