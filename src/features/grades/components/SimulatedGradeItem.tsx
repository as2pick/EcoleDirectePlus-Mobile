import React from "react";
import { Pressable, View } from "react-native";
import { Text as CoreText } from "@/components/core";
const Text = CoreText as any;
import { formatGradeText } from "@/features/grades/utils/helpers";
import Grade from "../models/Grade";

interface SimulatedGradeItemProps {
    grade: Grade;
    dispatch: (action: any) => void;
}

export default function SimulatedGradeItem({ grade, dispatch }: SimulatedGradeItemProps) {
    return (
        <Pressable
            style={{
                flexDirection: "row",
                marginHorizontal: 20,
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "hsl(206, 54%, 28%)",
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 13,
                borderColor: "hsl(206, 54%, 44%)",
                borderWidth: 1,
            }}
            onPress={() => {
                dispatch({
                    type: "REMOVE_SIMULATED_GRADE",
                    payload: grade.getGrade(),
                });
            }}
        >
            <Text style={{ flexShrink: 1 }} oneLine preset="label2">
                {grade.libelle}
            </Text>
            <Text preset="label1">
                {formatGradeText(grade.data.grade)}
                <Text preset="label3">
                    {grade.data.outOf !== 20 && `/${grade.data.outOf}`}
                </Text>
            </Text>
        </Pressable>
    );
}
