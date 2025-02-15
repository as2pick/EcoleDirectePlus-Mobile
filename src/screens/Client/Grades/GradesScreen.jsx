import { useTheme } from "@react-navigation/native";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GradesScreen() {
    const { colors } = useTheme();

    console.log(colors);
    return (
        <SafeAreaView>
            <Text>This is the Grades Page !</Text>
        </SafeAreaView>
    );
}

