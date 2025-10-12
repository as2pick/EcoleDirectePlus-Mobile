import { Text, TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";
import { parseNumber } from "../../../../../utils/grades/makeAverage";
import { formatGradeText } from "../helper";
import Grade from "./Grade";

export default class Discipline {
    constructor({
        code,
        libelle,
        averageDatas,
        coef,
        grades,
        streakCount,
        isDisciplineGroup,
        workforce,
        rank,
        teachers,
        classAssessment = undefined,
        userAssessment = undefined,
        disciplines = undefined, // beaceause we have disciplinesGroups "Matières Littéraires" or directly disciplines "MATHS"
        disciplineCodes = undefined,
    }) {
        this.code = code;
        this.libelle = libelle;
        this.averageDatas = averageDatas;
        this.coef = coef;
        this.grades = grades;
        this.streakCount = streakCount;
        this.isDisciplineGroup = isDisciplineGroup;
        this.workforce = workforce;
        this.rank = rank;
        this.teachers = teachers;
        this.classAssessment = classAssessment;
        this.userAssessment = userAssessment;
        this.disciplines = disciplines;
        this.disciplineCodes = disciplineCodes;
    }
    getDiscipline() {
        return {
            code: this.code,
            libelle: this.libelle,
            averageDatas: this.averageDatas,
            coef: this.coef,
            grades: this.grades,
            streakCount: this.streakCount,
            isDisciplineGroup: this.isDisciplineGroup,
            workforce: this.workforce,
            rank: this.rank,
            teachers: this.teachers,
            classAssessment: this.classAssessment,
            userAssessment: this.userAssessment,
            disciplines: this.disciplines,
            disciplineCodes: this.disciplineCodes,
        };
    }
    getTotalCoef() {
        return this.grades.reduce((sum, evaluation) => {
            const { notSignificant, data } = evaluation;
            const { coef, grade, outOf } = data;

            if (
                notSignificant ||
                grade === "" ||
                grade === null ||
                isNaN(grade) ||
                outOf === 0 ||
                outOf === "" ||
                isNaN(outOf) ||
                coef === 0 ||
                coef === "" ||
                isNaN(coef)
            ) {
                return sum;
            }

            return sum + coef;
        }, 0);
    }

    getWeightedAverage() {
        let totalWeightedScore = 0;
        let totalCoef = 0;

        this.grades.forEach((evaluation) => {
            const { notSignificant, data } = evaluation;
            const { grade, outOf, coef } = data;

            if (
                notSignificant ||
                grade === "" ||
                grade === null ||
                isNaN(grade) ||
                outOf === 0 ||
                outOf === "" ||
                isNaN(outOf) ||
                coef === 0 ||
                coef === "" ||
                isNaN(coef)
            ) {
                return;
            }

            const normalizedGrade = (grade / outOf) * 20;

            totalWeightedScore += normalizedGrade * coef;
            totalCoef += coef;
        });

        if (totalCoef === 0) return null;

        return parseNumber(totalWeightedScore / totalCoef);
    }
    getDisciplineGroupAverage() {
        const total = this.disciplines.reduce(
            (sum, item) => sum + item.averageDatas.userAverage * item.coef,
            0
        );

        const totalCoef = this.disciplines.reduce((sum, item) => sum + item.coef, 0);

        return parseNumber(total / totalCoef);
    }

    RenderDisciplineGroup({ dataLength, index }) {
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
                key={index}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        padding: 18,
                        alignItems: "center",
                    }}
                >
                    <Text style={{ fontSize: 20 }}>{this.libelle}</Text>
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
                        <Text style={{ fontSize: 24 }}>
                            {formatGradeText(this.averageDatas.userAverage)}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
    RenderDiscipline({
        index,
        dataLength,
        isExpanded,
        onPress,
        navigation,
        openAddGradeModal,
    }) {
        const averages = [
            { label: "Classe", value: this.averageDatas.classAverage },
            { label: "Max.", value: this.averageDatas.maxAverage },
            { label: "Min", value: this.averageDatas.minAverage },
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
                    {/* HEADER */}
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
                                        borderRadius: 500,
                                        backgroundColor:
                                            this.streakCount === 0
                                                ? "transparent"
                                                : "hsl(35, 100%, 50%)",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Text
                                        style={{ fontSize: 24, textAlign: "center" }}
                                    >
                                        {this.streakCount}
                                    </Text>
                                </View>
                            </View>
                            <View>
                                <Text style={{ fontSize: 14 }}>{this.libelle}</Text>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        opacity: 0.72,
                                    }}
                                >
                                    {Array.isArray(this.teachers)
                                        ? this.teachers.length > 1
                                            ? `${this.teachers[0]}...`
                                            : this.teachers[0]
                                        : this.teachers}
                                </Text>
                            </View>
                        </View>
                        <Text style={{ fontSize: 24 }}>
                            {formatGradeText(this.averageDatas.userAverage)}
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
                                            <Text>{formatGradeText(value)}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                            {this.grades.map((grade, idx) => {
                                return new Grade(grade).RenderGrade(
                                    navigation,
                                    idx,
                                    this.grades.length,
                                    openAddGradeModal
                                );
                            })}
                        </Animated.View>
                    )}
                </Animated.View>
            </TouchableOpacity>
        );
    }
}

