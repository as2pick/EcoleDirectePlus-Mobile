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
            {/* <EDPLogo /> */}
            <Button
                onPress={async () => {
                    await Keychain.resetGenericPassword();
                    await setIsConnected(false);
                }}
            >
                Disconect and forget secrets
            </Button>
            <InDev />
            {/* <View
                style={{
                    position: "absolute",
                    width: 300,
                    height: 300,
                    backgroundColor: "white",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            > */}
            {/* </View> */}
        </SafeAreaView>
    );
}

