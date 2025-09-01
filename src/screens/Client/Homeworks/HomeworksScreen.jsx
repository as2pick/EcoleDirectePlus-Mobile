import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientBackground } from "../../../components";
import { useUser } from "../../../context/UserContext";
import { storageServiceStates } from "../../../helpers/storageService";
export default function HomeworksScreen() {
    const { sortedHomeworksData, setSortedHomeworksData, userAccesToken } =
        useUser();
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            if (
                !sortedHomeworksData ||
                Object.keys(sortedHomeworksData).length === 0
            ) {
                setLoading(true);
                storageServiceStates
                    .getter({ originKey: "homeworks" })
                    .then((userGrades) => {
                        setSortedHomeworksData(userGrades);

                        setLoading(false);
                    })
                    .catch((err) => {
                        setError(err.message);
                        setLoading(false);
                    });
            }
        }, [userAccesToken, sortedHomeworksData])
    );
    return (
        <>
            <GradientBackground />
            <SafeAreaView>
                <ScrollView>
                    <Text>{JSON.stringify(sortedHomeworksData)}</Text>
                </ScrollView>
            </SafeAreaView>
        </>
    );
}

