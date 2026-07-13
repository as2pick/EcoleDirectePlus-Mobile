import React from "react";
import { View } from "react-native";
import { Text as CoreText } from "@/components/core";
const Text = CoreText as any;
import { formatGradeText } from "@/features/grades/utils/helpers";
import Discipline from "../models/Discipline";

interface DisciplineGroupItemProps {
    discipline: Discipline;
    dataLength: number;
    index: number;
}

export default function DisciplineGroupItem({ discipline, dataLength, index }: DisciplineGroupItemProps) {
    return (
        <View
            style={{
                backgroundColor: "hsl(240, 24%, 29%)",
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
                    alignItems: "center",
                }}
            >
                <Text style={{ width: "70%" }} oneLine preset="h4">
                    {discipline.libelle}
                </Text>
                <View
                    style={{
                        backgroundColor: "hsla(240, 26%, 13%, .35)",
                        borderRadius: 14,
                        paddingHorizontal: 8,
                        paddingVertical: 1,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Text preset="h3">
                        {formatGradeText(discipline.averageDatas.userAverage)}
                    </Text>
                </View>
            </View>
        </View>
    );
}
