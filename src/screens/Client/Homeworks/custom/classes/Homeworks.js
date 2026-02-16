import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity, View } from "react-native";
import { Text } from "../../../../../components/Ui/core";
import { formatDate, formatShortDate } from "../../../../../utils/date";
import base64Handler from "../../../../../utils/handleBase64";

export default class Homeworks {
    constructor({
        courseContent,
        discipline,
        givenOn,
        homeworksContent,
        id = null,
        isDone,
        isEvaluation,
        returnOnline = null,
        student = null,
        customHomeworkMd5Key = null,
        isCustom = false,
        date = null,
    }) {
        this.courseContent = courseContent;
        this.discipline = discipline;
        this.givenOn = givenOn || formatDate(new Date(), "ed");
        this.homeworksContent = homeworksContent;
        this.id = id;
        this.isDone = isDone;
        this.isEvaluation = isEvaluation;
        this.returnOnline = returnOnline;
        this.student = student;
        this.decodedHTMLCourseContent = "";
        this.decodedHTMLHomework = "";
        this.customHomeworkMd5Key = customHomeworkMd5Key;
        this.isCustom = isCustom;
        this.date = date;
    }
    getHomework() {
        let homeworksContent;

        if (this.isCustom) {
            // we have 0 joined docs
            homeworksContent = {
                content: this.homeworksContent.content,
                joinedDocuments: [],
            };
        } else {
            homeworksContent = this.homeworksContent;
        }
        return {
            courseContent: this.courseContent,
            discipline: this.discipline,
            givenOn: this.givenOn,
            homeworksContent: homeworksContent,
            id: this.id,
            isDone: this.isDone,
            isEvaluation: this.isEvaluation,
            returnOnline: this.returnOnline,
            student: this.student,
            decodedHTMLCourseContent: this.decodedHTMLCourseContent,
            decodedHTMLHomework: this.decodedHTMLHomework,
            customHomeworkMd5Key: this.customHomeworkMd5Key,
            isCustom: this.isCustom,
            date: this.date,
        };
    }
    decodeContent() {
        if (this.courseContent && this.courseContent !== "") {
            this.decodedHTMLCourseContent = base64Handler.decode(this.courseContent);
        }
        if (this.homeworksContent.content && this.homeworksContent.content !== "") {
            this.decodedHTMLHomework = base64Handler.decode(
                this.homeworksContent.content
            );
        }
    }

    RenderHomework({ dispatch }) {
        const gradientColors = this.isEvaluation
            ? ["hsl(2, 63%, 43%)", "hsl(2, 54%, 23%)"]
            : ["hsl(240, 19%, 38%)", "hsl(240, 20%, 23%)"];
        return (
            <TouchableOpacity
                onPress={() => {
                    dispatch({
                        type: "SEE_HOMEWORK_DETAILS",
                        payload: this.getHomework(),
                    });
                }}
            >
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
                                {this.discipline.name}
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
                                    {this.homeworksContent?.joinedDocuments
                                        ?.length || 0}
                                </Text>
                            </View>
                        </View>

                        <Text preset="label3" color="hsl(240, 19%, 68%)">
                            Mis en ligne le {formatShortDate(this.givenOn)}
                        </Text>
                    </View>

                    <TouchableOpacity // DEBUG
                        style={{
                            aspectRatio: 1,
                            width: 40,
                            backgroundColor: this.isDone ? "green" : "red",
                            marginLeft: 12,
                            borderRadius: "50%",
                        }}
                        onPress={() =>
                            dispatch({
                                type: "TOGGLE_HOMEWORK",
                                payload: {
                                    id: this.id,
                                    updates: { isDone: !this.isDone },
                                },
                            })
                        }
                    />
                </LinearGradient>
            </TouchableOpacity>
        );
    }
}

