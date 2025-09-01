import { Button } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientBackground } from "../../../components";
import InDev from "../../../components/Ui/InDev";
import { useUser } from "../../../context/UserContext";
import { routesNames } from "../../../router/config/routesNames";
import authService from "../../../services/login/authService";

export default function HomeScreen() {
    const { setIsConnected } = useUser();
    const navigation = useNavigation();
    return (
        <>
            <GradientBackground />
            <SafeAreaView>
                {/* <EDPLogo /> */}
                <Button
                    onPress={async () => {
                        await authService.deleteCredentials();
                        await setIsConnected(false);
                    }}
                >
                    Disconect and forget secrets
                </Button>
                <Button
                    onPress={() => navigation.navigate(routesNames.navigators.core)}
                >
                    Navigate to settings
                </Button>
                <InDev />
            </SafeAreaView>
        </>
    );
}

