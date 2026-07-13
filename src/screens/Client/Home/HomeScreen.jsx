import { Text } from "@/components";
import ActiveCourseCard from "@/features/home/components/ActiveCourseCard";
import { useCustomDataStore } from "@/hooks/useCustomDataStore";
import { useGrades } from "@/hooks/useGrades";
import { useHomeworks } from "@/hooks/useHomeworks";
import { useSignIn } from "@/hooks/useSignIn";
import { useUserStore } from "@/hooks/useUserStore";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";

export default function HomeScreen() {
    const { signOut } = useSignIn();
    const navigation = useNavigation();

    const token = useUserStore((state) => state.token);
    const { data: gradesData, isLoading, isError } = useGrades(token);
    const { data: homeworksData } = useHomeworks(token);
    const customHomeworksData = useCustomDataStore((state) => state.customHomeworks);

    console.log(gradesData?.lastGrades?.[0]);
    return (
        <LinearGradient
            colors={["hsla(228, 70%, 18%, 1)", "hsla(228, 30%, 8%, 0.85)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.3 }}
            style={{ flex: 1, paddingHorizontal: 20 }}
        >
            <View style={{ marginTop: "25%", marginBottom: 28 }}>
                <Text size={26} color="hsla(1, 0%, 100%, 0.4)">
                    Bonjour,
                </Text>
                <Text size={38}>Pierre</Text>
            </View>
            <View style={{ alignItems: "center" }}>
                <ActiveCourseCard />
            </View>
        </LinearGradient>
    );
}

