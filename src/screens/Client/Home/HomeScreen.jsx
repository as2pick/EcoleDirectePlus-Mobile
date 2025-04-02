import { Button } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import * as Keychain from "react-native-keychain";
import { SafeAreaView } from "react-native-safe-area-context";
import InDev from "../../../components/UI/InDev";
import { useUser } from "../../../context/UserContext";
import { routesNames } from "../../../router/config/routesNames";

export default function HomeScreen() {
    const { setIsConnected } = useUser();
    const navigation = useNavigation();
    return (
        <SafeAreaView>
            {/* <EDPLogo /> */}
            <Button
                onPress={async () => {
                    await Keychain.resetGenericPassword();
                    await setIsConnected(false);
                }}
            >
                Disconect and forget secrets
            </Button>
            <Button
                onPress={() => navigation.navigate(routesNames.navigators.settings)}
            >
                Navigate to settings
            </Button>
            <InDev />
        </SafeAreaView>
    );
}

