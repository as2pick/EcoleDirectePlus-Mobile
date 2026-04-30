import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatFrenchDate } from "../../../utils/date";

export default function GradeDetails({ route }) {
    const { gradeData } = route.params;

    return (
        <SafeAreaView>
            <Text>{gradeData.assignment}</Text>
            <Text>{gradeData.disciplineName}</Text>
            <Text>Date: {formatFrenchDate(gradeData.dateEntered)}</Text>
            <Text>
                Résultat: {gradeData.gradeDetails.studentGrade}/
                {gradeData.gradeDetails.denominator} (coef.{" "}
                {gradeData.gradeDetails.coef})
            </Text>
            <Text>Compétences: {JSON.stringify(gradeData.academicSkills)}</Text>
        </SafeAreaView>
    );
}

