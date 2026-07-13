import React from "react";
import { TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";
import { Text as CoreText } from "@/components/core";
const Text = CoreText as any;
import { formatGradeText } from "@/features/grades/utils/helpers";
import Discipline from "../models/Discipline";
import Grade from "../models/Grade";
import GradeItem from "./GradeItem";
import SimulatedGradeItem from "./SimulatedGradeItem";

interface DisciplineItemProps {
    discipline: Discipline;
    index: number;
    dataLength: number;
    isExpanded: boolean;
    onPress: () => void;
    dispatch: (action: any) => void;
}

export default function DisciplineItem({
    discipline,
    index,
    dataLength,
    isExpanded,
    onPress,
    dispatch,
}: DisciplineItemProps) {
    const averages = [
        { label: "Classe", value: discipline.averageDatas.classAverage },
        { label: "Max.", value: discipline.averageDatas.maxAverage },
        { label: "Min", value: discipline.averageDatas.minAverage },
    ];
    const boxStyle = {
        backgroundColor: "hsl(240, 33%, 50%)",
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 8,
    };

    return (
        <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
            <Animated.View
                style={{
                    backgroundColor: "hsl(240, 27%, 16%)",
                    overflow: "hidden",
                    ...(index === 0
                        ? {
                              borderTopLeftRadius: 12,
                              borderTopRightRadius: 12,
                              borderBottomLeftRadius: 3,
                              borderBottomRightRadius: 3,
                          }
                        : { borderRadius: 3 }),
                    ...(dataLength - 1 === index
                        ? {
                              borderTopLeftRadius: 3,
                              borderTopRightRadius: 3,
                              borderBottomLeftRadius: 12,
                              borderBottomRightRadius: 12,
                          }
                        : { borderRadius: 3 }),
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        padding: 18,
                        height: 80,
                        alignItems: "center",
                    }}
                >
                    <View style={{ flexDirection: "row", gap: 18 }}>
                        <View
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 500,
                                width: 42,
                                height: 42,
                                borderWidth: 2,
                                borderColor: "white",
                                backgroundColor: "hsl(240, 27%, 16%)",
                            }}
                        >
                            <View
                                style={{
                                    width: 34,
                                    height: 34,
                                    borderRadius: 17, // "50%" is invalid in TS / style objects sometimes, use number
                                    overflow: "hidden",
                                    backgroundColor:
                                        discipline.streakCount === 0
                                            ? "transparent"
                                            : "hsl(35, 100%, 50%)",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Text align="center" preset="h3">
                                    {discipline.streakCount}
                                </Text>
                            </View>
                        </View>
                        <View style={{ maxWidth: "64%" }}>
                            <Text oneLine preset="label2">
                                {discipline.libelle}
                            </Text>
                            <Text
                                style={{
                                    opacity: 0.72,
                                }}
                                oneLine
                                preset="label2"
                            >
                                {Array.isArray(discipline.teachers)
                                    ? discipline.teachers.length > 1
                                        ? `${discipline.teachers[0]}...`
                                        : discipline.teachers[0]
                                    : discipline.teachers}
                            </Text>
                        </View>
                    </View>
                    <Text preset="h3">
                        {formatGradeText(discipline.averageDatas.userAverage)}
                    </Text>
                </View>

                {isExpanded && (
                    <Animated.View style={{ gap: 8, paddingBottom: 18 }}>
                        <View
                            style={{
                                backgroundColor: "hsl(240, 27%, 60%)",
                                height: 1,
                                borderRadius: 5,
                                marginHorizontal: 18,
                            }}
                        />
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-around",
                                alignItems: "center",
                            }}
                        >
                            {averages.map(({ label, value }, idx) => (
                                <View
                                    key={idx}
                                    style={{
                                        alignItems: "center",
                                        marginBottom: 10,
                                    }}
                                >
                                    <Text style={{ marginBottom: 8 }}>
                                        {label}
                                    </Text>
                                    <View style={boxStyle}>
                                        <Text preset="label2">
                                            {formatGradeText(value)}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                        {discipline.grades
                            .filter((grade) => !grade.isSimulation)
                            .map((gradeData, idx) => {
                                const gradeObj = new Grade(gradeData);
                                return (
                                    <GradeItem
                                        key={`grade-${idx}`}
                                        grade={gradeObj}
                                        dispatch={dispatch}
                                    />
                                );
                            })}
                        <TouchableOpacity
                            onPress={() =>
                                dispatch({
                                    type: "OPEN_SIMULATION_MODAL",
                                    payload: {
                                        discipline: discipline.code,
                                        libelle: discipline.libelle,
                                    },
                                })
                            }
                            style={{
                                alignSelf: "center",
                            }}
                        >
                            <View
                                style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: "hsla(240, 14%, 32%, .25)",
                                    paddingHorizontal: 24,
                                    borderRadius: 20,
                                }}
                            >
                                <Text preset="h3" align="center">
                                    +
                                </Text>
                            </View>
                        </TouchableOpacity>
                        {discipline.grades
                            .filter((grade) => grade.isSimulation)
                            .map((gradeData, idx) => {
                                const gradeObj = new Grade(gradeData);
                                return (
                                    <SimulatedGradeItem
                                        key={`simulated-grade-${idx}`}
                                        grade={gradeObj}
                                        dispatch={dispatch}
                                    />
                                );
                            })}
                    </Animated.View>
                )}
            </Animated.View>
        </TouchableOpacity>
    );
}
