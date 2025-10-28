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
    RenderGrade(navigation, idx, gradeLength, openAddGradeModal) {
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
                    navigation.navigate(routesNames.client.grades.details, {
                        gradeData: this.getGrade(),
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
                        borderRadius: 13,
                        borderColor,
                        borderWidth: 1.4,
                    }}
                >
                    <Text
                        style={{ flexShrink: 1 }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {this.libelle}
                    </Text>
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

        // Si c'est la dernière note, ajouter le bouton "+" en dessous
        if (idx === gradeLength - 1) {
            return (
                <View key={idx}>
                    {gradeItem}
                    <TouchableOpacity
                        onPress={() => openAddGradeModal(this.codes)}
                        style={{ marginVertical: 20 }}
                    >
                        <View
                            style={{
                                marginHorizontal: 20,
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "hsla(240, 14%, 32%, .25)",
                                paddingHorizontal: 14,
                                paddingVertical: 2,
                                borderRadius: 20,
                                // marginTop: 8,
                                borderColor: "hsla(240, 14%, 32%, .6)",
                                borderWidth: 1,
                            }}
                        >
                            <Text>+</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        }

        return <View key={idx}>{gradeItem}</View>;
    }

    RenderSimulatedGrade(idx) {
        const gradeItem = (
            <View
                style={{
                    flexDirection: "row",
                    marginHorizontal: 20,
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "hsla(206, 54%, 28%)",
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 13,
                    borderColor: "hsla(206, 54%, 44%)",
                    borderWidth: 1.4,
                }}
            >
                <Text
                    style={{ flexShrink: 1 }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {this.libelle}
                </Text>
                <View
                    style={{
                        flexDirection: "row",
                        gap: 10,
                        marginHorizontal: 10,
                    }}
                ></View>
                <Text>
                    {formatGradeText(this.data.grade)}
                    {this.data.outOf !== 20 && `/${this.data.outOf}`}
                </Text>
            </View>
        );

        return <View key={idx}>{gradeItem}</View>;
    }
}

