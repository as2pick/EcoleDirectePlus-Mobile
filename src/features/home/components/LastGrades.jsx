import { Text } from "@/components";
import { routesNames } from "@/router/config/routesNames";
import { blendWithWhite } from "@/utils/colorGenerator";
import { useNavigation } from "@react-navigation/native";
import { useMemo } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
export default function LastGrades({ lastGradesObject }) {
    const navigation = useNavigation();
    // const hapticFeedback = useHaptic("heavy");

    // const onViewableItemsChanged = useRef(({ viewableItems }) => {
    //     if (viewableItems.length > 0) {
    //         hapticFeedback(); // the haptics doesn't work, idk why, maybe regenerate dev client ?
    //     }
    // }).current;

    // const viewabilityConfig = useRef({
    //     itemVisiblePercentThreshold: 50,
    // }).current;

    return (
        <View style={{ height: 100 }}>
            <FlatList
                // onViewableItemsChanged={onViewableItemsChanged}
                // viewabilityConfig={viewabilityConfig}
                data={lastGradesObject}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.libelle}
                contentContainerStyle={{ gap: 10 }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate(routesNames.client.grades.group, {
                                screen: routesNames.client.grades.details,
                                params: {
                                    gradeData: item,
                                    disciplineData: item.disciplineData,
                                },
                            });
                        }}
                    >
                        <GradeCard
                            disciplineColor={item.disciplineColor}
                            disciplineData={item.disciplineData}
                            data={item.data}
                        />
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}
const GradeCard = ({ disciplineColor, disciplineData: { libelle }, data }) => {
    const lightColor = useMemo(
        () => blendWithWhite(disciplineColor, 0.35),
        [disciplineColor]
    );
    return (
        <View
            style={{
                backgroundColor: "hsla(235, 28%, 15%, 1)",
                borderRadius: 16,
                width: 150,
                paddingHorizontal: 20,
                paddingVertical: 19,
                justifyContent: "space-between",
            }}
        >
            <Text align="left" oneLine style={{ color: disciplineColor }}>
                {libelle.toUpperCase()}
            </Text>

            <View
                style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    justifyContent: "center",
                }}
            >
                <Text preset="h3" color={lightColor}>
                    {data.grade.toFixed(2)}
                    <Text preset="label2" color="hsla(1, 0%, 100%, .55)">
                        /{data.outOf}
                    </Text>
                </Text>
                <Text
                    preset="label3"
                    color="hsla(1, 0%, 100%, .55)"
                    style={{ marginLeft: 2 }}
                >
                    ({data.coef})
                </Text>
            </View>
        </View>
    );
};

