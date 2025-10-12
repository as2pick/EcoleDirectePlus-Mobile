import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GradeDetails({ route }) {
    const { gradeData } = route.params;

    return (
        <SafeAreaView>
            <Text>{JSON.stringify(gradeData)}</Text>
        </SafeAreaView>
    );
}

