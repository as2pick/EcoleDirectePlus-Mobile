import { LinearGradient } from "expo-linear-gradient";
import { useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GradeArrow from "../../../assets/svg/GradeArrow";
import Text from "../Ui/core/Text";

export default function OnboardingItem({ item }) {
    const { width } = useWindowDimensions();

    return (
        <LinearGradient
            colors={item.gradient.colors}
            start={item.gradient.start}
            end={item.gradient.end}
            locations={item.gradient.locations}
            style={{ width, height: "100%", flex: 1 }}
        >
            <SafeAreaView
                style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
            >
                <View
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        flex: 1,
                    }}
                >
                    <Text size={48} weight="bold">
                        {item.displayText}
                    </Text>

                    <View
                        style={{
                            alignItems: "center",
                            flexDirection: "row",
                            justifyContent: "center",
                        }}
                    >
                        <GradeArrow />
                        <Text weight="bold" size={64}>
                            {item.value}
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

