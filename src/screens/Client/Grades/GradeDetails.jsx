import { Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import {
    BestGrade,
    EqualToDisciplineAverage,
    MaxGrade,
    UpperThanClassAverage,
    UpperThanDisciplineAverage,
    UpTheStreak,
} from "../../../../assets/svg/badges";
import { CustomTopHeader } from "../../../components";
import { formatFrenchDate } from "../../../utils/date";
import Discipline from "./custom/classes/Discipline";
import Grade from "./custom/classes/Grade";
import { formatGradeText } from "./custom/helper";

export default function GradeDetails({ route }) {
    const { gradeData, disciplineData } = route.params;

    const grade = new Grade(gradeData);
    const discipline = new Discipline(disciplineData);

    const uiBadges = {
        max_grade: MaxGrade,
        best_grade: BestGrade,
        upper_than_class_average: UpperThanClassAverage,
        upper_than_discipline_average: UpperThanDisciplineAverage,
        up_the_streak: UpTheStreak,
        equal_to_discipline_average: EqualToDisciplineAverage,
    };
    const skillsCorespondances = {
        "Non acquis": "hsl(0, 40%, 50%)",
        "Partiellement acquis": "hsl(60, 70%, 40%)",
        Acquis: "hsl(200, 40%, 50%)",
        Dépassé: "hsl(130, 50%, 60%)",
    };

    const renderItem = ({ item }) => {
        return (
            <View style={{ minWidth: "90%", marginVertical: 10 }}>
                <Text
                    style={{
                        fontSize: 16,
                        color: "hsl(240, 40%, 75%)",
                        textDecorationStyle: "solid",
                        textDecorationLine: "underline",
                        marginBottom: 4,
                    }}
                >
                    {item.name}
                </Text>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "flex-start",
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            marginLeft: 16,
                            color: "hsl(240, 40%, 68%)",
                            flex: 1,
                            flexShrink: 1,
                        }}
                    >
                        {item.description}
                    </Text>
                    <Text
                        style={{
                            color: skillsCorespondances[item.value],
                            marginLeft: 8,
                            width: "30%",
                            flexShrink: 1,
                            textAlign: "right",
                        }}
                    >
                        {item.value}
                    </Text>
                </View>
            </View>
        );
    };
    return (
        <View style={{ flex: 1, backgroundColor: "hsl(240, 28%, 10%)" }}>
            <CustomTopHeader headerTitle={grade.libelle} height={33} />
            <View style={{ marginHorizontal: 22, flex: 1 }}>
                <View
                    style={{
                        backgroundColor: "hsl(240, 27%, 16%)",
                        flexDirection: "row",
                        padding: 24,
                        borderRadius: 10,
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <View
                        style={{
                            flexDirection: "column",
                            maxWidth: "70%",
                        }}
                    >
                        <Text style={{ fontSize: 16 }}>{grade.disciplineName}</Text>
                        <View style={{}}>
                            <Teachers teachers={discipline.teachers} />
                        </View>
                    </View>
                    <View
                        style={{
                            backgroundColor: "hsla(240, 24%, 29%, .35)",
                            borderRadius: 12,
                            paddingHorizontal: 12,
                            paddingVertical: 4,
                        }}
                    >
                        <Text style={{ fontSize: 24 }}>
                            {formatGradeText(discipline.averageDatas.userAverage)}
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        gap: 12,

                        marginTop: 14,
                    }}
                >
                    <Cards datas={grade.data} />
                </View>
                <View
                    style={{
                        backgroundColor: "hsl(240, 27%, 16%)",
                        borderRadius: 22,
                        flex: 1,
                        marginVertical: 14,
                        alignItems: "center",
                        padding: 14,
                    }}
                >
                    <Text style={{ fontSize: 28 }}>Informations</Text>
                    {grade.badges.length > 0 && (
                        <View
                            style={{
                                flexDirection: "row",
                                gap: 10,
                                marginHorizontal: 10,
                                backgroundColor: "hsla(230, 24%, 50%, .4)",
                                paddingVertical: 10,
                                paddingHorizontal: 12,
                                borderRadius: 8,
                                marginTop: 8,
                            }}
                        >
                            {grade.badges.map((badge, i) => {
                                const BadgeComponent = uiBadges[badge];
                                return (
                                    <BadgeComponent
                                        key={`${badge}-${i}`}
                                        size={22}
                                    />
                                );
                            })}
                        </View>
                    )}

                    <View style={{ alignSelf: "flex-start", marginTop: 8 }}>
                        <Text style={{ fontSize: 14 }}>
                            · Type d’évaluation : {grade.homeworkType}
                        </Text>
                        <Text style={{ fontSize: 14 }}>
                            · Date: {formatFrenchDate(grade.date)}
                        </Text>
                    </View>
                    <FlatList
                        data={grade.skills}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
            </View>
        </View>
    );
}

const Teachers = ({ teachers = [] }) => {
    const textStyle = {
        color: "hsl(240, 27%, 76%)",
        fontSize: 14,
    };

    if (teachers.length > 1) {
        return teachers.map((teacher, i) => (
            <Text key={i} style={textStyle} numberOfLines={1} ellipsizeMode="tail">
                - {teacher}
            </Text>
        ));
    } else if (teachers.length === 1) {
        return (
            <Text style={textStyle} numberOfLines={1} ellipsizeMode="tail">
                {teachers[0]}
            </Text>
        );
    } else {
        return <Text style={textStyle}>No teachers for this discipline</Text>;
    }
};

const Cards = ({ datas }) => {
    const { grade, coef, outOf } = datas;

    const cardsStyle = {
        backgroundColor: "hsl(240, 24%, 29%)",
        flex: 1,
        flexShrink: 0,
        aspectRatio: 1,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "space-evenly",
    };
    const textsStyle = {
        color: "hsl(240, 27%, 76%)",
        fontSize: 14,
    };

    const cards = [
        { label: "Note obtenue", value: formatGradeText(grade) },
        { label: "Coefficient", value: formatGradeText(coef, "auto") },
        { label: "Dénominateur", value: `/${outOf}` },
    ];

    return (
        <>
            {cards.map((card, index) => (
                <View key={index} style={cardsStyle}>
                    <Text style={textsStyle} numberOfLines={2}>
                        {card.label}
                    </Text>
                    <Text
                        style={{
                            fontSize: 24,
                        }}
                    >
                        {card.value}
                    </Text>
                </View>
            ))}
        </>
    );
};

