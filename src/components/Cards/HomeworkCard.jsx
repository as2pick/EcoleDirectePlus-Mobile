import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity, View } from "react-native";
import { serializeHomework } from "../../screens/Client/Homeworks/utils";
import { formatShortDate } from "../../utils/date";
import { Text } from "../Ui/core";

export default function HomeworkCard({ homework, dispatch, enabled = true }) {
    const gradientColors = homework.isEvaluation
        ? ["hsl(2, 63%, 43%)", "hsl(2, 54%, 23%)"]
        : ["hsl(240, 19%, 38%)", "hsl(240, 20%, 23%)"];

    const handlePress = () => {
        dispatch({
            type: "SEE_HOMEWORK_DETAILS",
            payload: serializeHomework(homework),
        });
    };
    const handleToggle = () =>
        dispatch({
            type: "TOGGLE_HOMEWORK",
            payload: {
                id: homework.id,
                isCustom: homework.isCustom,
                updates: { isDone: !homework.isDone },
            },
        });
    return (
        <TouchableOpacity onPress={handlePress} disabled={!enabled}>
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                locations={[0.17, 1]}
                style={{
                    height: 100,
                    borderRadius: 20,
                    overflow: "hidden",
                    padding: 14,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",

                    boxShadow: [
                        {
                            offsetX: 0,
                            offsetY: 0,
                            blurRadius: 7.5,
                            spreadDistance: 3,
                            color: "hsla(0, 0%, 0%, 0.2)",
                        },
                    ],
                }}
            >
                <View
                    style={{
                        justifyContent: "space-between",
                        height: "100%",
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            gap: 8,
                            alignItems: "center",
                        }}
                    >
                        <Text preset="label1" oneLine>
                            {homework.discipline.name}
                        </Text>
                        <View
                            style={{
                                backgroundColor: "hsl(240, 30%, 71%)",
                                width: 24,
                                height: 24,
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 12,
                            }}
                        >
                            <Text preset="label3" align="center">
                                {homework.homeworksContent?.joinedDocuments
                                    ?.length || 0}
                            </Text>
                        </View>
                    </View>

                    <Text preset="label3" color="hsl(240, 19%, 68%)">
                        Mis en ligne le {formatShortDate(homework.givenOn)}
                    </Text>
                </View>

                <TouchableOpacity // DEBUG
                    style={{
                        aspectRatio: 1,
                        width: 40,
                        backgroundColor: homework.isDone ? "green" : "red",
                        marginLeft: 12,
                        borderRadius: "50%",
                    }}
                    onPress={handleToggle}
                />
            </LinearGradient>
        </TouchableOpacity>
    );
}

