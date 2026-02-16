import { useTheme } from "@react-navigation/native";
import { ScrollView, useWindowDimensions, View } from "react-native";
import RenderHTML from "react-native-render-html";
import { CustomTopHeader, SwipeBackWrapper } from "../../../components";
import { Text } from "../../../components/Ui/core";
import Homeworks from "./custom/classes/Homeworks";
import { useHomework } from "./custom/context/LocalContext";

export default function HomeworkDetails({ route }) {
    const { width } = useWindowDimensions();
    const { dispatch } = useHomework();
    const { homeworksData } = route.params;
    const { colors } = useTheme();

    const homework = new Homeworks(homeworksData);
    if (!homework.isCustom) homework.decodeContent();

    const homeworkContent = homework.isCustom
        ? homework.homeworksContent.content
        : homework.getHomework().decodedHTMLHomework;
    return (
        <SwipeBackWrapper>
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
                    {homework.RenderHomework({ dispatch, enabled: false })}
                    <View
                        style={{
                            backgroundColor: colors.bg.bg4,
                            flex: 1,
                            padding: 25,
                            borderRadius: 21,
                        }}
                    >
                        <ScrollView style={{ flex: 1 }}>
                            {homework.isCustom ? (
                                <Text>{homeworkContent}</Text>
                            ) : (
                                <RenderHTML
                                    contentWidth={width}
                                    source={{ html: homeworkContent }}
                                    baseStyle={{
                                        color: colors.contrast,
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
        </SwipeBackWrapper>
    );
}

