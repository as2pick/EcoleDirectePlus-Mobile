import { Text, TouchableOpacity, View } from "react-native";
import {
    BestGrade,
    EqualToDisciplineAverage,
    MaxGrade,
    UpperThanClassAverage,
    UpperThanDisciplineAverage,
    UpTheStreak,
} from "../../../../../../assets/svg/badges";
import { routesNames } from "../../../../../router/config/routesNames";
import { formatGradeText } from "../../../../../utils/grades/grades";

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
        };
    }
    RenderGrade(navigation, idx) {
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
                backgroundColor = "hsl(240, 24%, 28%)";
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

        return (
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate(routesNames.client.grades.details, {
                        gradeData: this.getGrade(),
                    })
                }
                key={idx}
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
                        borderRadius: 13,
                    }}
                >
                    <Text style={{}}>{this.libelle}</Text>
                    <View
                        style={{
                            flexDirection: "row",
                            gap: 10,
                            marginHorizontal: 10,
                        }}
                    >
                        {this.badges.map((badge, i) => {
                            const BadgeComponent = uiBadges[badge];
                            return (
                                <BadgeComponent key={`${badge}-${i}`} size={24} />
                            );
                        })}
                    </View>
                    <Text>
                        {formatGradeText(this.data.grade)}
                        {this.data.outOf !== 20 && `/${this.data.outOf}`}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}

