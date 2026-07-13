import React from "react";
import { TouchableOpacity, View } from "react-native";
import {
    BestGrade,
    EqualToDisciplineAverage,
    MaxGrade,
    UpperThanClassAverage,
    UpperThanDisciplineAverage,
    UpTheStreak,
} from "@/components/svg";
import { Text as CoreText } from "@/components/core";
const Text = CoreText as any;
import { cssHslaToHsla } from "@/utils/colorGenerator";
import { formatGradeText } from "@/features/grades/utils/helpers";
import Grade from "../models/Grade";

interface GradeItemProps {
    grade: Grade;
    dispatch: (action: any) => void;
}

export default function GradeItem({ grade, dispatch }: GradeItemProps) {
    const uiBadges: Record<string, any> = {
        max_grade: MaxGrade,
        best_grade: BestGrade,
        upper_than_class_average: UpperThanClassAverage,
        upper_than_discipline_average: UpperThanDisciplineAverage,
        up_the_streak: UpTheStreak,
        equal_to_discipline_average: EqualToDisciplineAverage,
    };

    let backgroundColor = "";
    switch (grade.actionOnStreak) {
        case "nothing":
            backgroundColor = "hsla(240, 24%, 28%, 1)";
            break;
        case "up":
            backgroundColor = "hsla(36, 100%, 34%, .3)";
            break;
        case "previous up":
            backgroundColor = "hsla(240, 10%, 41%, .3)";
            break;
        default:
            backgroundColor = "red";
    }

    const hsla = cssHslaToHsla(backgroundColor);
    const borderColor = `hsla(${hsla[0]}, ${hsla[1]}%, ${hsla[2] + 16}%, ${hsla[3]})`;

    return (
        <TouchableOpacity
            onPress={() =>
                dispatch({
                    type: "SEE_GRADE_DETAILS",
                    payload: grade.getGrade(),
                })
            }
        >
            <View
                style={{
                    flexDirection: "row",
                    marginHorizontal: 20,
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor,
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 10,
                    borderColor,
                    borderWidth: 1,
                }}
            >
                <Text style={{ flexShrink: 1 }} oneLine preset="label2">
                    {grade.libelle}
                </Text>
                <View
                    style={{
                        flexDirection: "row",
                        gap: 10,
                        marginHorizontal: 10,
                    }}
                >
                    {grade.badges &&
                        grade.badges.map((badge, i) => {
                            const BadgeComponent = uiBadges[badge];
                            if (!BadgeComponent) return null;
                            return (
                                <BadgeComponent
                                    key={`${badge}-${i}`}
                                    size={24}
                                />
                            );
                        })}
                </View>
                <Text preset="label1">
                    {grade.notSignificant
                        ? `(${formatGradeText(grade.data.grade)})`
                        : formatGradeText(grade.data.grade)}
                    <Text preset="label3">
                        {grade.data.outOf !== 20 && `/${grade.data.outOf}`}
                    </Text>
                </Text>
            </View>
        </TouchableOpacity>
    );
}
