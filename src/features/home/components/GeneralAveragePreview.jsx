import { Text } from "@/components";
import { useCurrentTime } from "@/hooks/useCurrentTime";
import { routesNames } from "@/router/config/routesNames";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";

export default function GeneralAveragePreview({}) {
    const navigation = useNavigation();
    const currentTime = useCurrentTime();
    return (
        <TouchableOpacity
            onPress={() => {
                navigation.navigate(routesNames.client.grades.group, {
                    screen: routesNames.client.grades.content,
                });
            }}
            style={{
                width: "100%",
                backgroundColor: "hsl(235, 28%, 15%)",
                borderRadius: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 19,
                paddingVertical: 24,
            }}
        >
            <View style={{ gap: 5 }}>
                <Text preset="title1" color="hsl(228, 100%, 69%)">
                    {"Moyenne Générale".toUpperCase() /* j'autorise les jugements */}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Text preset="label2" color="hsla(0, 0%, 100%, 0.55)">
                        Trimestre 1
                    </Text>
                    <View
                        style={{
                            width: 4,
                            height: 4,
                            borderRadius: 10,
                            backgroundColor: "hsla(0, 0%, 100%, 0.55)",
                        }}
                    />
                    <Text preset="label2" color="hsla(0, 0%, 100%, 0.55)">
                        {currentTime.date.split("-")[0]}
                    </Text>
                </View>
            </View>
            <Text size={34} weight="bold">
                15.50
                <Text size={16} color="hsla(0, 0%, 100%, 0.55)">
                    /20
                </Text>
            </Text>
        </TouchableOpacity>
    );
}

