import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { routesNames } from "../../../router/config/routesNames";
import HomeworkDetails from "./HomeworkDetails";
import HomeworksContent from "./HomeworksContent";
import { HomeworksProvider } from "./context/LocalContext";

const NativeStack = createNativeStackNavigator();

export default function HomeworksScreen() {
    const {
        client: {
            homeworks: { content, details },
        },
    } = routesNames;
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

    return (
        <HomeworksProvider>
            <NativeStack.Navigator
                initialRouteName={content}
                screenOptions={{
                    headerShown: false,
                    animation: "fade",
                }}
            >
                <NativeStack.Screen name={content} component={HomeworksContent} />
                <NativeStack.Screen name={details} component={HomeworkDetails} />
            </NativeStack.Navigator>
        </HomeworksProvider>
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

