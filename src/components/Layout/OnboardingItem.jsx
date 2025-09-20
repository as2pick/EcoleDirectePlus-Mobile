import { LinearGradient } from "expo-linear-gradient";
import { Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GradeArrow from "../../../assets/svg/GradeArrow";

export default function OnboardingItem({ item }) {
    const { width } = useWindowDimensions();
    console.log(item);

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
                    <Text style={{ fontSize: 48, fontWeight: "900" }}>
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
                        <Text
                            style={{
                                fontSize: 64,
                                fontWeight: "900",
                            }}
                        >
                            {item.value}
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

