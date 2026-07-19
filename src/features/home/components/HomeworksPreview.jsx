import { Text } from "@/components";
import { useHaptic } from "@/hooks/useHaptics";
import { routesNames } from "@/router/config/routesNames";
import { formatFrenchDate } from "@/utils/date";
import { useNavigation } from "@react-navigation/native";
import { useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";

export default function HomeworksPreview({}) {
    const [hk] = useState([
        {
            discipline: {
                name: "Xnf ",
            },
            givenOn: "2026-07-13",
            homeworksContent: {
                content: "Xnfn",
            },
            id: 14455,
            isDone: "done",
            loadingState: "idle",
            isEvaluation: true,
            returnOnline: null,
            student: null,
            customHomeworkMd5Key: "1e2253e4562d102506c896fe7244b6d2",
            isCustom: true,
            date: "2026-07-14",
            decodedHTMLCourseContent: "",
            decodedHTMLHomework: "",
        },
        {
            discipline: {
                name: "Uu",
            },
            givenOn: "2026-07-13",
            homeworksContent: {
                content: "Ubuntu ",
            },
            id: 14917,
            isDone: "todo",
            loadingState: "idle",
            isEvaluation: true,
            returnOnline: null,
            student: null,
            customHomeworkMd5Key: "d1715ba71146e7b91e5c60d9498a731f",
            isCustom: true,
            date: "2026-07-25",
            decodedHTMLCourseContent: "",
            decodedHTMLHomework: "",
        },
        {
            discipline: {
                name: "Jjj",
            },
            givenOn: "2026-07-13",
            homeworksContent: {
                content: "J",
            },
            id: 16884,
            isDone: "done",
            loadingState: "idle",
            isEvaluation: false,
            returnOnline: null,
            student: null,
            customHomeworkMd5Key: "9921f98f1d1dfbec6ffe9402f0324b91",
            isCustom: true,
            date: "2026-07-14",
            decodedHTMLCourseContent: "",
            decodedHTMLHomework: "",
        },
        {
            discipline: {
                name: "Louj",
            },
            givenOn: "2026-07-13",
            homeworksContent: {
                content: "Nlk",
            },
            id: 15840,
            isDone: "done",
            loadingState: "idle",
            isEvaluation: false,
            returnOnline: null,
            student: null,
            customHomeworkMd5Key: "e0bde500169d92232dc3498988d9a105",
            isCustom: true,
            date: "2026-07-14",
            decodedHTMLCourseContent: "",
            decodedHTMLHomework: "",
        },
        {
            discipline: {
                name: "Pojn",
            },
            givenOn: "2026-07-13",
            homeworksContent: {
                content: "Kolk",
            },
            id: 15654,
            isDone: "done",
            loadingState: "idle",
            isEvaluation: false,
            returnOnline: null,
            student: null,
            customHomeworkMd5Key: "5703ab8029530370aa8f9a7f822a00b1",
            isCustom: true,
            date: "2026-07-14",
            decodedHTMLCourseContent: "",
            decodedHTMLHomework: "",
        },
        {
            discipline: {
                name: "Pugv",
            },
            givenOn: "2026-07-13",
            homeworksContent: {
                content: "Vyuu",
            },
            id: 17376,
            isDone: "done",
            loadingState: "idle",
            isEvaluation: false,
            returnOnline: null,
            student: null,
            customHomeworkMd5Key: "0e1f81d739acf2305ccba586685ec6a8",
            isCustom: true,
            date: "2026-07-14",
            decodedHTMLCourseContent: "",
            decodedHTMLHomework: "",
        },
        {
            discipline: {
                name: "Vu",
            },
            givenOn: "2026-07-13",
            homeworksContent: {
                content: "H",
            },
            id: 15964,
            isDone: "done",
            loadingState: "idle",
            isEvaluation: false,
            returnOnline: null,
            student: null,
            customHomeworkMd5Key: "3c32baea0906ad20abaa2cb91c29a818",
            isCustom: true,
            date: "2026-07-14",
            decodedHTMLCourseContent: "",
            decodedHTMLHomework: "",
        },
        {
            discipline: {
                name: "Pokkk",
            },
            givenOn: "2026-07-13",
            homeworksContent: {
                content: "Bhhg",
            },
            id: 19700,
            isDone: "todo",
            loadingState: "idle",
            isEvaluation: false,
            returnOnline: null,
            student: null,
            customHomeworkMd5Key: "d6d6a3d52f76f81bba3ccecd04e2c9e1",
            isCustom: true,
            date: "2026-07-14",
            decodedHTMLCourseContent: "",
            decodedHTMLHomework: "",
        },
        {
            discipline: {
                name: "Zigicnd",
            },
            givenOn: "2026-07-13",
            homeworksContent: {
                content: "Ebcj de e",
            },
            id: 18835,
            isDone: "todo",
            loadingState: "idle",
            isEvaluation: false,
            returnOnline: null,
            student: null,
            customHomeworkMd5Key: "4a2b0d34ea0922aa309b3f43f0280ed2",
            isCustom: true,
            date: "2026-07-14",
            decodedHTMLCourseContent: "",
            decodedHTMLHomework: "",
        },
        {
            discipline: {
                name: "Ekrjkce'dk",
            },
            givenOn: "2026-07-13",
            homeworksContent: {
                content: "Nwnedjfj",
            },
            id: 16964,
            isDone: "todo",
            loadingState: "idle",
            isEvaluation: false,
            returnOnline: null,
            student: null,
            customHomeworkMd5Key: "f44dbe70f2f0c152cec299902973a3d8",
            isCustom: true,
            date: "2026-07-14",
            decodedHTMLCourseContent: "",
            decodedHTMLHomework: "",
        },
        {
            discipline: {
                name: "Doekfkfnck",
            },
            givenOn: "2026-07-13",
            homeworksContent: {
                content: "Fkek3748",
            },
            id: 17526,
            isDone: "todo",
            loadingState: "idle",
            isEvaluation: true,
            returnOnline: null,
            student: null,
            customHomeworkMd5Key: "befdca1b70e885f9d6e6a9a1ef44f2d9",
            isCustom: true,
            date: "2026-07-14",
            decodedHTMLCourseContent: "",
            decodedHTMLHomework: "",
        },
        {
            discipline: {
                name: "Dkekficbd",
            },
            givenOn: "2026-07-13",
            homeworksContent: {
                content: "Sjenxidnck",
            },
            id: 19668,
            isDone: "todo",
            loadingState: "idle",
            isEvaluation: false,
            returnOnline: null,
            student: null,
            customHomeworkMd5Key: "3c6291b8b998a4d54e64d48488bfac28",
            isCustom: true,
            date: "2026-07-16",
            decodedHTMLCourseContent: "",
            decodedHTMLHomework: "",
        },
        {
            discipline: {
                name: "Dndnfncnc",
            },
            givenOn: "2026-07-13",
            homeworksContent: {
                content: "Qaoaldldnbdf",
            },
            id: 14758,
            isDone: "todo",
            loadingState: "idle",
            isEvaluation: true,
            returnOnline: null,
            student: null,
            customHomeworkMd5Key: "b6de61c7aba30d3be1c6a3fda62b1355",
            isCustom: true,
            date: "2026-07-16",
            decodedHTMLCourseContent: "",
            decodedHTMLHomework: "",
        },
        {
            discipline: {
                name: "Zksdnncnc",
            },
            givenOn: "2026-07-13",
            homeworksContent: {
                content: "Skekfkcn",
            },
            id: 18482,
            isDone: "todo",
            loadingState: "idle",
            isEvaluation: false,
            returnOnline: null,
            student: null,
            customHomeworkMd5Key: "5c0164a602692e9eb4fb5a7be6a86201",
            isCustom: true,
            date: "2026-07-16",
            decodedHTMLCourseContent: "",
            decodedHTMLHomework: "",
        },
        {
            discipline: {
                name: "Zozieixcn",
            },
            givenOn: "2026-07-13",
            homeworksContent: {
                content: "Xkfnfncnd",
            },
            id: 19284,
            isDone: "todo",
            loadingState: "idle",
            isEvaluation: false,
            returnOnline: null,
            student: null,
            customHomeworkMd5Key: "7c4fffd8e2d2c72095c985084fa5ae3a",
            isCustom: true,
            date: "2026-07-16",
            decodedHTMLCourseContent: "",
            decodedHTMLHomework: "",
        },
        {
            discipline: {
                name: "Z13579MAge:)*!mB6X58%e+6QDw}c",
            },
            givenOn: "2026-07-13",
            homeworksContent: {
                content: "€(33(8_+'",
            },
            id: 19551,
            isDone: "todo",
            loadingState: "idle",
            isEvaluation: false,
            returnOnline: null,
            student: null,
            customHomeworkMd5Key: "5d183b8d3bf1eb8f2cc27d781133a15e",
            isCustom: true,
            date: "2026-07-16",
            decodedHTMLCourseContent: "",
            decodedHTMLHomework: "",
        },
        {
            discipline: {
                name: "Dkenficen",
            },
            givenOn: "2026-07-13",
            homeworksContent: {
                content: "Dkeksk2848'n",
            },
            id: 16650,
            isDone: "todo",
            loadingState: "idle",
            isEvaluation: false,
            returnOnline: null,
            student: null,
            customHomeworkMd5Key: "20fa5bd6e15debf74ef6553fe8012639",
            isCustom: true,
            date: "2026-07-16",
            decodedHTMLCourseContent: "",
            decodedHTMLHomework: "",
        },
        {
            discipline: {
                name: "Skekxk",
            },
            givenOn: "2026-07-13",
            homeworksContent: {
                content: "Zk DC ueucuxg jette",
            },
            id: 18752,
            isDone: "todo",
            loadingState: "idle",
            isEvaluation: false,
            returnOnline: null,
            student: null,
            customHomeworkMd5Key: "6b1eafb61c9ff25409c4f045946bb0be",
            isCustom: true,
            date: "2026-07-17",
            decodedHTMLCourseContent: "",
            decodedHTMLHomework: "",
        },
        {
            discipline: {
                name: "Zkcienc",
            },
            givenOn: "2026-07-13",
            homeworksContent: {
                content: "Celui je hier CBD de Gwen l'un",
            },
            id: 15526,
            isDone: "todo",
            loadingState: "idle",
            isEvaluation: false,
            returnOnline: null,
            student: null,
            customHomeworkMd5Key: "0afb23a0e995ec72f36c661bbac038a1",
            isCustom: true,
            date: "2026-07-17",
            decodedHTMLCourseContent: "",
            decodedHTMLHomework: "",
        },
        {
            discipline: {
                name: "Trundgnfbsfbsgbsgbsgbsgb",
            },
            givenOn: "2026-07-13",
            homeworksContent: {
                content: "Dtjvvetbscbeh rg rgfh f fh fh fh'hf'w",
            },
            id: 19940,
            isDone: "todo",
            loadingState: "idle",
            isEvaluation: true,
            returnOnline: null,
            student: null,
            customHomeworkMd5Key: "c329b3d77290caaa727377fab2113163",
            isCustom: true,
            date: "2026-07-18",
            decodedHTMLCourseContent: "",
            decodedHTMLHomework: "",
        },
        {
            discipline: {
                name: "Wvnddhnd",
            },
            givenOn: "2026-07-13",
            homeworksContent: {
                content: "Det dh ge eu du funffxj ",
            },
            id: 14417,
            isDone: "todo",
            loadingState: "idle",
            isEvaluation: true,
            returnOnline: null,
            student: null,
            customHomeworkMd5Key: "9bb530aaa918715ee40200160d84bec5",
            isCustom: true,
            date: "2026-07-19",
            decodedHTMLCourseContent: "",
            decodedHTMLHomework: "",
        },
    ]);

    const navigation = useNavigation();
    const haptic = useHaptic("light");
    const groupedHomeworks = useMemo(() => {
        const groups = new Map();

        for (const homework of hk) {
            if (!groups.has(homework.date)) {
                groups.set(homework.date, []);
            }

            groups.get(homework.date).push(homework);
        }

        return [...groups.entries()].sort(([a], [b]) => new Date(a) - new Date(b));
    }, [hk]);

    return (
        <View style={{ width: "100%", flex: 1 }}>
            {groupedHomeworks.map(([date, homeworks]) => (
                <View key={date}>
                    <DateHeader date={date} countForDate={homeworks.length} />

                    {homeworks.map((item, index) => (
                        <TouchableOpacity
                            key={item.customHomeworkMd5Key}
                            onPress={() => {
                                haptic();
                                navigation.navigate(
                                    routesNames.client.homeworks.group,
                                    {
                                        screen: routesNames.client.homeworks.details,
                                        params: { homeworksData: item },
                                    }
                                );
                            }}
                        >
                            <Homework
                                key={item.customHomeworkMd5Key}
                                homework={item}
                                index={index}
                                countForDate={homeworks.length}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            ))}
        </View>
    );
}

const DateHeader = ({ date, countForDate }) => (
    <View
        style={{
            paddingVertical: 8,
            paddingHorizontal: 4,
            flexDirection: "row",
            justifyContent: "space-between",
        }}
    >
        <Text preset="title1">POUR {formatFrenchDate(date).toUpperCase()}</Text>
        <Text preset="h4" color="hsl(228, 100%, 69%)">
            {countForDate}
        </Text>
    </View>
);

const Homework = ({ homework, index, countForDate }) => {
    let borderRadiusStyle = {};
    const BORDER_RADIUS_EXT = 28;
    const BORDER_RADIUS_INT = 8;
    if (index === 0) {
        borderRadiusStyle = {
            borderTopLeftRadius: BORDER_RADIUS_EXT,
            borderTopRightRadius: BORDER_RADIUS_EXT,
            borderBottomLeftRadius: BORDER_RADIUS_INT,
            borderBottomRightRadius: BORDER_RADIUS_INT,
        };
    } else if (index === countForDate - 1) {
        borderRadiusStyle = {
            borderTopLeftRadius: BORDER_RADIUS_INT,
            borderTopRightRadius: BORDER_RADIUS_INT,
            borderBottomLeftRadius: BORDER_RADIUS_EXT,
            borderBottomRightRadius: BORDER_RADIUS_EXT,
        };
    } else {
        borderRadiusStyle = {
            borderTopLeftRadius: BORDER_RADIUS_INT,
            borderTopRightRadius: BORDER_RADIUS_INT,
            borderBottomLeftRadius: BORDER_RADIUS_INT,
            borderBottomRightRadius: BORDER_RADIUS_INT,
        };
    }

    return (
        <View
            style={[
                {
                    flex: 1,
                    backgroundColor: "hsl(235, 28%, 15%)",
                    marginVertical: 2,
                    alignItems: "center",
                    flexDirection: "row",
                    padding: 19,
                    gap: 10,
                },
                borderRadiusStyle,
            ]}
        >
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                    gap: 6,
                }}
            >
                <Text preset="title1" oneLine style={{ flexShrink: 1 }}>
                    {homework.discipline.name}
                </Text>
                <Text
                    preset="label2"
                    color="hsla(1, 0%, 100%, 0.55)"
                    oneLine
                    style={{ flexShrink: 1 }}
                >
                    {homework.homeworksContent.content}
                </Text>
            </View>

            {homework.isEvaluation && (
                <View
                    style={{
                        flexShrink: 1,
                        backgroundColor: "hsla(219, 100%, 69%, 0.75)",
                        borderColor: "hsla(219, 100%, 69%, 1)",
                        borderWidth: 1,
                        borderRadius: 12,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                    }}
                >
                    <Text preset="label2">Contrôle</Text>
                </View>
            )}
        </View>
    );
};
