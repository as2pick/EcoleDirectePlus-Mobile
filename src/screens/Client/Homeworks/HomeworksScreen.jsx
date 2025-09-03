import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
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
        <SafeAreaView>
            <ScrollView>
                {/* <Text>{JSON.stringify(sortedHomeworksData)}</Text> */}
            </ScrollView>
        </SafeAreaView>
    );
}

