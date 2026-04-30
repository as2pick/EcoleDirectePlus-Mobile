import { Button } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import InDev from "../../../components/Ui/InDev";
import { useSingIn } from "../../../context/SignInContext";
import { routesNames } from "../../../router/config/routesNames";

export default function HomeScreen() {
    const { signOut } = useSingIn();
    const navigation = useNavigation();
    return (
        <SafeAreaView>
            {/* <EDPLogo /> */}
            <Button
                onPress={async () => {
                    await signOut();
                }}
            >
                Disconect and forget secrets
            </Button>
            <Button onPress={() => navigation.navigate(routesNames.navigators.core)}>
                Navigate to settings
            </Button>
            <InDev />
        </SafeAreaView>
    );
}

