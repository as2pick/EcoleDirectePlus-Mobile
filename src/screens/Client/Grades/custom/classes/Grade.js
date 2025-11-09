import { Pressable, TouchableOpacity, View } from "react-native";
import {
    BestGrade,
    EqualToDisciplineAverage,
    MaxGrade,
    UpperThanClassAverage,
    UpperThanDisciplineAverage,
    UpTheStreak,
} from "../../../../../../assets/svg/badges";
import { Text } from "../../../../../components/Ui/core";
import { cssHslaToHsla } from "../../../../../utils/colorGenerator";
import { formatGradeText } from "../helper";

export default class Grade {
    constructor({
        libelle,
        notSignificant,
        date,
        homeworkType,
        disciplineName,
        codes,
        data,
        skills,
        onlySkills,
        isExam,
        actionOnStreak = "nothing",
        badges,
        isSimulation = false,
    }) {
        this.libelle = libelle;
        this.notSignificant = notSignificant;
        this.date = date;
        this.homeworkType = homeworkType;
        this.disciplineName = disciplineName;
        this.codes = codes;
        this.data = data;
        this.skills = skills;
        this.onlySkills = onlySkills;
        this.isExam = isExam;
        this.actionOnStreak = actionOnStreak;
        this.badges = badges;
        this.isSimulation = isSimulation;
    }

    getGrade() {
        return {
            libelle: this.libelle,
            notSignificant: this.notSignificant,
            date: this.date,
            homeworkType: this.homeworkType,
            disciplineName: this.disciplineName,
            codes: this.codes,
            data: this.data,
            skills: this.skills,
            onlySkills: this.onlySkills,
            isExam: this.isExam == undefined ? false : this.isExam,
            actionOnStreak: this.actionOnStreak,
            badges: this.badges,
            isSimulation: this.isSimulation,
        };
    }
    RenderGrade(idx, dispatch) {
        if (this.isSimulation)
            console.log("You asked to render a simulated grade as normal grade !");

        const uiBadges = {
            max_grade: MaxGrade,
            best_grade: BestGrade,
            upper_than_class_average: UpperThanClassAverage,
            upper_than_discipline_average: UpperThanDisciplineAverage,
            up_the_streak: UpTheStreak,
            equal_to_discipline_average: EqualToDisciplineAverage,
        };

        let backgroundColor = null;
        switch (this.actionOnStreak) {
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

        const gradeItem = (
            <TouchableOpacity
                onPress={() =>
                    dispatch({
                        type: "SEE_GRADE_DETAILS",
                        payload: this.getGrade(),
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
                        {this.libelle}
                    </Text>
                    <View
                        style={{
                            flexDirection: "row",
                            gap: 10,
                            marginHorizontal: 10,
                        }}
                    >
                        {this.badges &&
                            this.badges.map((badge, i) => {
                                const BadgeComponent = uiBadges[badge];
                                return (
                                    <BadgeComponent
                                        key={`${badge}-${i}`}
                                        size={24}
                                    />
                                );
                            })}
                    </View>
                    <Text preset="label1">
                        {this.notSignificant
                            ? `(${formatGradeText(this.data.grade)})`
                            : formatGradeText(this.data.grade)}
                        <Text preset="label3">
                            {this.data.outOf !== 20 && `/${this.data.outOf}`}
                        </Text>
                    </Text>
                </View>
            </TouchableOpacity>
        );

        return <View key={idx}>{gradeItem}</View>;
    }

    RenderSimulatedGrade(idx, dispatch) {
        if (!this.isSimulation)
            console.log("You asked to render a normal grade as simulated grade !");
        const gradeItem = (
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
                        payload: this.getGrade(),
                    });
                }}
            >
                <Text style={{ flexShrink: 1 }} oneLine preset="label2">
                    {this.libelle}
                </Text>
                {/* <View
                    style={{
                        flexDirection: "row",
                        gap: 10,
                        marginHorizontal: 10,
                    }}
                ></View> */}
                <Text preset="label1">
                    {formatGradeText(this.data.grade)}
                    <Text preset="label3">
                        {this.data.outOf !== 20 && `/${this.data.outOf}`}
                    </Text>
                </Text>
            </Pressable>
        );

        return <View key={idx}>{gradeItem}</View>;
    }
}

