import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../context/ThemeContext";
import { useUser } from "../../../context/UserContext";
import { storageServiceStates } from "../../../helpers/storageService";
export default function HomeworksScreen() {
    const { sortedHomeworksData, setSortedHomeworksData, userAccesToken } =
        useUser();
    const [, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {
        toggleTheme,
        colorScheme,
        isFollowingSystem,
        followSystemTheme,
        setManualTheme,
    } = useTheme();
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
                        setError(null);
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
        <SafeAreaView style={{ flex: 1 }}>
            {/* <ScrollView> */}
            {error && <Text>{error}</Text>}
            <View
                style={{
                    transform: [{ scaleX: 5 }, { scaleY: 5 }],
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 1,
                }}
            >
                {/* <Text>{JSON.stringify(sortedHomeworksData)}</Text> */}
                <Switch value={colorScheme === "dark"} onValueChange={toggleTheme} />
                <Switch
                    value={isFollowingSystem}
                    onValueChange={(value) => {
                        if (value) {
                            followSystemTheme();
                        } else {
                            setManualTheme(colorScheme);
                        }
                    }}
                />
            </View>
            {/* </ScrollView> */}
        </SafeAreaView>
    );
}

