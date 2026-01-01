import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import InDev from "../../../components/Ui/InDev";
import { useActionBar } from "../../../context/ActionBarContext";
import MessagingIcon from "../../../../assets/svg/navigation/MessagingIcon";

export default function MessagingScreen() {
    const { updateActions } = useActionBar();

    useFocusEffect(
        useCallback(() => {
            updateActions([
                {
                    icon: MessagingIcon,
                    onPress: () => console.log("Messaging Action"),
                },
            ]);
        }, [updateActions])
    );
    return (
        <SafeAreaView>
            <InDev />
        </SafeAreaView>
    );
}

