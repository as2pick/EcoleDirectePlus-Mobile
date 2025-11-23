import { useEffect, useState } from "react";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { Text } from "../../../../../components/Ui/core";
import { useHomework } from "../context/LocalContext";

const PLACEHOLDERS = { coef: 1, grade: 15, outOf: 20 };

export default function NewHomeworkModal({ visible }) {
    const { state, dispatch } = useHomework();
    const [isRendered, setIsRendered] = useState(false);
    const translateY = useSharedValue(500);
    const opacity = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            setIsRendered(true);
            translateY.value = withTiming(0, {
                duration: 450,
            });
            opacity.value = withTiming(1, { duration: 250 });
        } else {
            translateY.value = withTiming(
                500,
                {
                    duration: 350,
                },
                () => {
                    scheduleOnRN(setIsRendered, false);
                }
            );
            opacity.value = withTiming(0, { duration: 250 });
        }
    }, [visible]);

    const modalStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const handleClose = () => {
        dispatch({ type: "CLOSE_NEW_HOMEWORK_MODAL" });
    };

    if (!isRendered) return null;

    return (
        <View
            style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                zIndex: 1000,
            }}
        >
            <Animated.View
                style={[
                    {
                        flex: 1,
                        backgroundColor: "rgba(0,0,0,0.7)",
                    },
                    backdropStyle,
                ]}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={handleClose}
                    style={{ flex: 1 }}
                />
            </Animated.View>
            <Animated.View
                style={[
                    {
                        position: "absolute",
                        bottom: 0,
                        width: "100%",
                        backgroundColor: "hsl(240, 35%, 11%)",
                        borderTopLeftRadius: 42,
                        borderTopRightRadius: 42,
                        paddingHorizontal: 24,
                        paddingTop: 16,
                        paddingBottom: 40,
                        minHeight: 400,
                        maxHeight: "85%",
                    },
                    modalStyle,
                ]}
            >
                <View
                    style={{
                        width: 50,
                        height: 5,
                        backgroundColor: "hsla(240, 20%, 60%, 0.4)",
                        borderRadius: 3,
                        alignSelf: "center",
                        marginBottom: 24,
                    }}
                />
                <View style={{ marginBottom: 24 }}>
                    <Text preset="h2">Ajouter un devoir</Text>
                    <Text
                        style={{
                            marginTop: 4,
                        }}
                        preset="body2"
                    >
                        Ajouter un devoir pour s'épargner l'agenda !
                    </Text>
                </View>

                {/* ScrollView avec flexGrow: 1 et paddingBottom */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ marginBottom: 8 }} preset="label1">
                            Matière
                        </Text>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: "hsla(240, 30%, 20%, 0.8)",
                                borderRadius: 13,
                                paddingHorizontal: 16,
                                borderWidth: 1,
                                borderColor: "hsla(240, 20%, 40%, 0.3)",
                                minHeight: 50,
                                justifyContent: "center",
                            }}
                        >
                            <TextInput
                                placeholder="Mathématiques"
                                placeholderTextColor={"hsla(0, 100%, 100%, .25)"}
                                keyboardType="default"
                                style={{ fontSize: 16 }}
                            />
                        </View>
                    </View>
                    <View style={{ marginBottom: 20, alignItems: "center" }}>
                        <Text
                            style={{ marginBottom: 8 }}
                            preset="label1"
                            align="center"
                        >
                            Date
                        </Text>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: "hsla(240, 30%, 20%, 0.8)",
                                borderRadius: 13,
                                paddingHorizontal: 16,
                                borderWidth: 1,
                                borderColor: "hsla(240, 20%, 40%, 0.3)",
                                width: "40%",
                                justifyContent: "center",
                            }}
                        >
                            <TextInput
                                placeholder="12/12/12"
                                textAlign="center"
                                placeholderTextColor={"hsla(0, 100%, 100%, .25)"}
                                keyboardType="default"
                                style={{ fontSize: 16 }}
                            />
                        </View>
                    </View>

                    <View style={{}}>
                        <Text style={{ marginBottom: 8 }} preset="label1">
                            Tâche à faire
                        </Text>
                        <View
                            style={{
                                backgroundColor: "hsla(240, 30%, 20%, 0.8)",
                                borderRadius: 13,
                                paddingHorizontal: 16,
                                paddingVertical: 7,
                                borderWidth: 1,
                                borderColor: "hsla(240, 20%, 40%, 0.3)",
                                minHeight: 250,
                            }}
                        >
                            <TextInput
                                placeholder="Décris la tâche à faire..."
                                placeholderTextColor={"hsla(0, 100%, 100%, .25)"}
                                keyboardType="default"
                                style={{ fontSize: 16 }}
                                multiline={true}
                            />
                        </View>
                    </View>
                </ScrollView>

                <View style={{ flexDirection: "row", gap: 12 }}>
                    <TouchableOpacity
                        onPress={handleClose}
                        style={{
                            flex: 1,
                            backgroundColor: "hsla(240, 30%, 25%, 0.8)",
                            paddingVertical: 16,
                            borderRadius: 13,
                            alignItems: "center",
                        }}
                    >
                        <Text preset="label1">Annuler</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            backgroundColor: "hsl(240, 50%, 55%)",
                            paddingVertical: 16,
                            borderRadius: 13,
                            alignItems: "center",
                        }}
                        onPress={handleClose}
                    >
                        <Text preset="label1">Ajouter</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
}

