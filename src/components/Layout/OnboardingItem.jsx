import { Text, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingItem({ item }) {
    const { width } = useWindowDimensions();
    console.log(item);
    return (
        <SafeAreaView
            style={{
                width,

                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "red",
            }}
        >
            <Text>{item.displayText}</Text>
            <Text>{item.value}</Text>
        </SafeAreaView>
    );
}

