import { useEffect, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import { getTodayDateString } from "../../../../../utils/date";
import { parseNumber } from "../../../../../utils/grades/makeAverage";
import Grade from "../classes/Grade";
import { useGrade } from "../context/LocalContext";

const PLACEHOLDERS = { coef: 1, grade: 15, outOf: 20 };

export default function AddGradeModal({ visible, disciplineCodes }) {
    const [simulatedGrade, setSimulatedGrade] = useState(PLACEHOLDERS);
    const [simulationCount, setSimulationCount] = useState(1);
    const translateY = useSharedValue(500);
    const opacity = useSharedValue(0);
    const { state, dispatch } = useGrade();

    useEffect(() => {
        if (visible) {
            translateY.value = withSpring(0, { damping: 75 });
            opacity.value = withTiming(1, { duration: 300 });
        } else {
            translateY.value = withTiming(500, { duration: 300 });
            opacity.value = withTiming(0, { duration: 300 });
        }
    }, [visible]);

    const modalStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    if (!visible) return null;

    return (
        <View
            style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                zIndex: 1000,
            }}
        >
            <Animated.View
                style={[
                    {
                        flex: 1,
                        backgroundColor: "rgba(0,0,0,0.7)",
                    },
                    backdropStyle,
                ]}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => dispatch({ type: "CLOSE_SIMULATION_MODAL" })}
                    style={{ flex: 1 }}
                />
            </Animated.View>

            <Animated.View
                style={[
                    {
                        position: "absolute",
                        bottom: 0,
                        width: "100%",
                        backgroundColor: "hsl(240, 35%, 11%)",
                        borderTopLeftRadius: 42,
                        borderTopRightRadius: 42,
                        paddingHorizontal: 24,
                        paddingTop: 16,
                        paddingBottom: 40,
                        minHeight: 400,
                        maxHeight: "85%",
                    },
                    modalStyle,
                ]}
            >
                <View
                    style={{
                        width: 50,
                        height: 5,
                        backgroundColor: "hsla(240, 20%, 60%, 0.4)",
                        borderRadius: 3,
                        alignSelf: "center",
                        marginBottom: 24,
                    }}
                />

                <View style={{ marginBottom: 24 }}>
                    <Text style={{ fontSize: 28, fontWeight: "bold" }}>
                        Ajouter une note
                    </Text>
                    <Text
                        style={{
                            fontSize: 14,
                            marginTop: 4,
                        }}
                    >
                        Simulez une note pour voir son impact
                    </Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ marginBottom: 8, fontSize: 16 }}>Note</Text>
                        <View style={{ flexDirection: "row", gap: 12 }}>
                            <View
                                style={{
                                    flex: 1,
                                    backgroundColor: "hsla(240, 30%, 20%, 0.8)",
                                    borderRadius: 13,
                                    paddingHorizontal: 16,
                                    paddingVertical: 14,
                                    borderWidth: 1,
                                    borderColor: "hsla(240, 20%, 40%, 0.3)",
                                }}
                            >
                                <TextInput
                                    placeholder={String(PLACEHOLDERS.grade)}
                                    onChangeText={(text) =>
                                        setSimulatedGrade((prev) => ({
                                            ...prev,
                                            grade: parseNumber(text),
                                        }))
                                    }
                                    keyboardType="numeric"
                                    style={{ fontSize: 16 }}
                                />
                            </View>
                            <Text
                                style={{
                                    alignSelf: "center",
                                    fontSize: 20,
                                    opacity: 0.5,
                                }}
                            >
                                /
                            </Text>
                            <View
                                style={{
                                    flex: 1,
                                    backgroundColor: "hsla(240, 30%, 20%, 0.8)",
                                    borderRadius: 13,
                                    paddingHorizontal: 16,
                                    paddingVertical: 14,
                                    borderWidth: 1,
                                    borderColor: "hsla(240, 20%, 40%, 0.3)",
                                }}
                            >
                                <TextInput
                                    placeholder={String(PLACEHOLDERS.outOf)}
                                    onChangeText={(text) =>
                                        setSimulatedGrade((prev) => ({
                                            ...prev,
                                            outOf: parseNumber(text),
                                        }))
                                    }
                                    keyboardType="numeric"
                                    style={{ fontSize: 16 }}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ marginBottom: 8, fontSize: 16 }}>
                            Coefficient
                        </Text>
                        <View
                            style={{
                                backgroundColor: "hsla(240, 30%, 20%, 0.8)",
                                borderRadius: 13,
                                paddingHorizontal: 16,
                                paddingVertical: 14,
                                borderWidth: 1,
                                borderColor: "hsla(240, 20%, 40%, 0.3)",
                            }}
                        >
                            <TextInput
                                placeholder={String(PLACEHOLDERS.coef)}
                                onChangeText={(text) =>
                                    setSimulatedGrade((prev) => ({
                                        ...prev,
                                        coef: parseNumber(text),
                                    }))
                                }
                                keyboardType="numeric"
                                style={{ fontSize: 16 }}
                            />
                        </View>
                    </View>
                </ScrollView>

                {simulatedGrade.grade > simulatedGrade.outOf && (
                    <View
                        style={{
                            backgroundColor: "hsla(0, 70%, 50%, 0.2)",
                            borderRadius: 10,
                            padding: 12,
                            marginBottom: 20,
                            borderWidth: 1,
                            borderColor: "hsla(0, 70%, 50%, 0.5)",
                            flex: 1,
                        }}
                    >
                        <Text
                            style={{
                                color: "hsla(0, 70%, 70%, 1)",
                                fontSize: 14,
                            }}
                        >
                            ⚠️ La note ne peut pas être supérieure au barème
                        </Text>
                    </View>
                )}

                <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
                    <TouchableOpacity
                        onPress={() => dispatch({ type: "CLOSE_SIMULATION_MODAL" })}
                        style={{
                            flex: 1,
                            backgroundColor: "hsla(240, 30%, 25%, 0.8)",
                            paddingVertical: 16,
                            borderRadius: 13,
                            alignItems: "center",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "600",
                            }}
                        >
                            Annuler
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            backgroundColor: "hsl(240, 50%, 55%)",
                            paddingVertical: 16,
                            borderRadius: 13,
                            alignItems: "center",
                        }}
                        onPress={() => {
                            setSimulationCount((prev) => prev + 1);
                            const generateGradeSimulation = new Grade({
                                data: simulatedGrade,
                                codes: {
                                    discipline: disciplineCodes.discipline,
                                    period: disciplineCodes.period,
                                },
                                date: getTodayDateString(),
                                disciplineName: disciplineCodes.libelle,
                                libelle: `Simulation #${simulationCount}`,
                                notSignificant: false,
                                onlySkills: false,
                                isSimulation: true,
                            });

                            dispatch({
                                type: "CREATE_SIMULATED_GRADE",
                                payload: generateGradeSimulation.getGrade(),
                            });
                            setSimulatedGrade(PLACEHOLDERS);
                            dispatch({
                                type: "CLOSE_SIMULATION_MODAL",
                            });
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "600",
                            }}
                        >
                            Simuler
                        </Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
}

