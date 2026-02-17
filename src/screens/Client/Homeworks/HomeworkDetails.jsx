import { useNavigation, useTheme } from "@react-navigation/native";
import {
    ScrollView,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";
import RenderHTML from "react-native-render-html";
import { CustomTopHeader } from "../../../components";
import { Text } from "../../../components/Ui/core";
import { formatFrenchDate } from "../../../utils/date";
import Homeworks from "./custom/classes/Homeworks";
import { useHomework } from "./custom/context/LocalContext";

export default function HomeworkDetails({ route }) {
    const { width } = useWindowDimensions();
    const { dispatch } = useHomework();
    const { homeworksData } = route.params;
    const { colors } = useTheme();
    const navigation = useNavigation();

    const homework = new Homeworks(homeworksData);
    if (!homework.isCustom) homework.decodeContent();

    const homeworkContent = homework.isCustom
        ? homework.homeworksContent.content
        : homework.getHomework().decodedHTMLHomework;
    return (
        // <SwipeBackWrapper >
        <View
            style={{
                flex: 1,
                backgroundColor: colors.background.gradient,
                marginHorizontal: 20,
                marginBottom: 110,
            }}
        >
            <CustomTopHeader
                headerTitle={"Retour aux tâches"}
                backArrow={{ color: colors.contrast, size: 24 }}
                height={33}
                backgroundColor={colors.background.gradient}
            />
            <View style={{ flex: 1, gap: 18 }}>
                <TouchableOpacity
                    activeOpacity={1}
                    onLongPress={() => {
                        if (homework.isCustom) {
                            console.log("service d'impression bonjour");
                            dispatch({
                                type: "REMOVE_CUSTOM_HOMEWORK",
                                payload: homework.getHomework(),
                            });
                            navigation.goBack();
                        }
                    }}
                >
                    {homework.RenderHomework({ dispatch, enabled: false })}
                </TouchableOpacity>
                <View
                    style={{
                        backgroundColor: colors.bg.bg4,
                        flex: 1,
                        padding: 25,
                        borderRadius: 21,
                        boxShadow: [
                            {
                                offsetX: 0,
                                offsetY: 0,
                                blurRadius: 7.5,
                                spreadDistance: 6,
                                color: "hsla(0, 0%, 0%, 0.25)",
                            },
                        ],
                    }}
                >
                    <Text
                        preset="title1"
                        align="center"
                        decoration="underline"
                        style={{ marginBottom: 20 }}
                    >
                        Pour le{" "}
                        {formatFrenchDate(homeworksData.date).replace(
                            /^[A-Z]/,
                            (match) => match.toLowerCase() // put first letter in lowercase ex: Lundi --> lundi
                        )}
                    </Text>
                    <ScrollView style={{ flex: 1 }}>
                        {homework.isCustom ? (
                            <Text>{homeworkContent}</Text>
                        ) : (
                            <RenderHTML
                                contentWidth={width}
                                source={{ html: homeworkContent }}
                                ignoredDomTags={["script", "iframe", "object"]}
                                baseStyle={{
                                    color: colors.contrast,
                                }}
                                tagsStyles={{
                                    u: {
                                        textDecorationLine: "underline",
                                    },
                                    i: {
                                        fontStyle: "italic",
                                    },
                                    strong: {
                                        fontWeight: 700,
                                    },
                                }}
                            />
                        )}
                    </ScrollView>
                </View>
                {homework.homeworksContent.joinedDocuments.length > 0 && (
                    <View
                        style={{
                            backgroundColor: colors.bg.bg4,
                            padding: 25,
                            borderRadius: 21,
                        }}
                    >
                        <Text preset="">
                            "Here's the joined documents if they exists"
                        </Text>
                    </View>
                )}
            </View>
        </View>
        // </SwipeBackWrapper>
    );
}

