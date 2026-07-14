import { Text } from "@/components";
import { useGrades } from "@/features/grades";
import ActiveCourseCard from "@/features/home/components/ActiveCourseCard";
import GeneralAveragePreview from "@/features/home/components/GeneralAveragePreview";
import HomeworksPreview from "@/features/home/components/HomeworksPreview";
import LastGrades from "@/features/home/components/LastGrades";
import { useHomeworks } from "@/features/homeworks";
import { useCustomDataStore } from "@/hooks/useCustomDataStore";
import { useSignIn } from "@/hooks/useSignIn";
import { useUserStore } from "@/hooks/useUserStore";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, View } from "react-native";

export default function HomeScreen() {
    const { signOut } = useSignIn();
    const navigation = useNavigation();

    const token = useUserStore((state) => state.token);
    const { data: gradesData, isLoading, isError } = useGrades(token);
    const { data: homeworksData } = useHomeworks(token);
    const customHomeworksData = useCustomDataStore((state) => state.customHomeworks);
    return (
        <LinearGradient
            colors={["hsla(228, 70%, 18%, 1)", "hsla(228, 30%, 8%, 0.85)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.3 }}
            style={{ flex: 1, paddingHorizontal: 20 }}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                bounces={false}
                scrollEventThrottle={16}
                overScrollMode="never"
            >
                <View style={{ marginTop: "25%", marginBottom: 28 }}>
                    <Text size={26} color="hsla(1, 0%, 100%, 0.4)">
                        Bonjour,
                    </Text>
                    <Text size={38}>Pierre</Text>
                </View>
                <View style={{ alignItems: "center", gap: 20 }}>
                    <ActiveCourseCard />
                    <GeneralAveragePreview />

                    <LastGrades />
                    <HomeworksPreview />
                </View>
            </ScrollView>
        </LinearGradient>
    );
}

