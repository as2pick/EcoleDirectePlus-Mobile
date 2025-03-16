import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AccountIcon from "../../../assets/svg/AccountIcon.jsx";
import DiscordLogo from "../../../assets/svg/DiscordLogo.jsx";
import EDPLogo from "../../../assets/svg/EDPLogo.jsx";
import GithubLogo from "../../../assets/svg/GithubLogo.jsx";
import KeyIcon from "../../../assets/svg/KeyIcon.jsx";
import {
    A2fSelectableModal,
    CheckBox,
    LinkButton,
    OverLoader,
} from "../../../components/index.js";

import { getApiMessage } from "../../../constants/api/codes.js";
import { useSingIn } from "../../../context/SignInContext.jsx";
import { cssRgbToHsl } from "../../../utils/colorGenerator.js";

export default function LoginScreen({ theme }) {
    const navigation = useNavigation();

    const {
        signIn,
        mcqDatas,
        setChoice,
        setMcqDatas,
        apiError,
        setApiError,
        state,
    } = useSingIn();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [keepConnected, setKeepConnected] = useState(true);
    const [loginStates, setLoginStates] = useState({
        loading: false,
        decodedChoices: [],
        decodedQuestion: null,
    });
    const [loading, setLoading] = useState(null);
    const [showLoader, setShowLoader] = useState(false);

    useEffect(() => {
        if (!state || !apiError) return;
        setLoading(false);
    }, [state, apiError]);

    const toggleModal = useCallback(() => {
        setModalVisible((lastState) => !lastState);
    }, []);

    const handleModalSubmit = async (item) => {
        setLoading(true);
        setChoice(mcqDatas.choices[item]);
        setMcqDatas("");
    };

    useEffect(() => {
        if (!mcqDatas) return;
        if (!("choices" in mcqDatas) || !("question" in mcqDatas)) {
            const message = getApiMessage(1005);
            // provoquer une erreur avec le screen d'error (not implemented yet)
        }

        setLoginStates((prevState) => ({
            ...prevState,
            decodedChoices: [...Object.keys(mcqDatas.choices)],
            decodedQuestion: Object.keys(mcqDatas.question)[0],
        }));
        setLoading(false);
        toggleModal();
    }, [mcqDatas]);

    const [h, s, l] = cssRgbToHsl(theme.colors.border);
    const borderColor = `hsl(${h}, ${s - 60}%, ${l - 34}%)`;

    return (
        <SafeAreaView style={[styles.container]}>
            <SafeAreaView style={styles.logos}>
                <LinkButton url={"https://discord.gg/AKAqXfTgvE"}>
                    <DiscordLogo fill={theme.colors.txt.txt3} size={28} />
                </LinkButton>

                <LinkButton
                    url={"https://github.com/as2pick/EcoleDirectePlus-Mobile"}
                >
                    <GithubLogo fill={theme.colors.txt.txt3} size={28} />
                </LinkButton>
            </SafeAreaView>
            <OverLoader
                bgOpacityValue={0.54}
                loaderStyles={styles.loader}
                annimationStartTiming={800}
                triggerStateArr={[loading, setLoading]}
                triggerViewArr={[showLoader, setShowLoader]}
            />

            <View style={styles.form}>
                <View style={styles.logo.box}>
                    <EDPLogo size={88} />
                    <Text
                        style={[styles.logo.text, { color: theme.colors.txt.txt3 }]}
                    >
                        Connexion
                    </Text>
                </View>
                <View style={[styles.input.box]}>
                    <View style={styles.input.cases}>
                        <View style={styles.input.logos}>
                            <TextInput
                                placeholder="Identifiant"
                                onChangeText={(data) => {
                                    setApiError(null);
                                    setUsername(data);
                                }}
                                value={username}
                                style={[
                                    styles.input.case,
                                    {
                                        borderColor: theme.colors.border,
                                        backgroundColor: theme.colors.background,
                                        color: theme.colors.txt.txt1,
                                    },
                                ]}
                            />
                            <View style={styles.input.icon}>
                                <AccountIcon />
                            </View>
                        </View>
                        <View style={styles.input.logos}>
                            <TextInput
                                placeholder="Mot de passe"
                                onChangeText={(data) => {
                                    setApiError(null);
                                    setPassword(data);
                                }}
                                value={password}
                                secureTextEntry
                                style={[
                                    styles.input.case,
                                    {
                                        borderColor: theme.colors.border,
                                        backgroundColor: theme.colors.background,
                                        color: theme.colors.txt.txt1,
                                    },
                                ]}
                            />
                            <View style={styles.input.icon}>
                                <KeyIcon />
                            </View>
                        </View>
                        <View style={styles.checkBox}>
                            <CheckBox
                                initialValue={keepConnected}
                                onValueChange={(v) => setKeepConnected(v)}
                                libelle="Rester connecté"
                            />
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={() => {
                        setLoading(true);
                        signIn({
                            username: username,
                            password: password,
                            keepConnected: keepConnected,
                        });
                        setApiError(null);
                    }}
                    style={{ theme: theme }}
                >
                    <Text
                        style={[
                            {
                                color: theme.colors.txt.txt1,
                                borderColor: theme.colors.border,
                                transform: [{ scale: 1.2 }],
                            },
                            styles.button,
                        ]}
                    >
                        {"Se connecter      ➜"}
                    </Text>
                </TouchableOpacity>
            </View>
            {apiError && (
                <Text
                    style={{
                        color: "rgb(240, 90, 90)",
                        padding: 12,
                        backgroundColor: theme.colors.bg.bg2,
                        borderColor: "rgb(240, 60, 60)",
                        borderWidth: 0.9,
                        borderRadius: 12,
                    }}
                >
                    {apiError}
                </Text>
            )}
            <View style={styles.infos}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate("PrivacyPolicy");
                    }}
                >
                    <Text
                        style={[
                            styles.privacyPolicy,
                            {
                                color: theme.colors.txt.txt2,
                            },
                        ]}
                    >
                        Politique de confidentialité et Conditions d'utilisation
                    </Text>
                </TouchableOpacity>
            </View>
            <View>
                <A2fSelectableModal
                    visible={modalVisible}
                    onClose={toggleModal}
                    items={loginStates.decodedChoices}
                    onSelect={handleModalSubmit}
                    question={loginStates.decodedQuestion}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    logos: {
        flexDirection: "row",
        position: "absolute",
        top: 12,
        left: 8,
        marginLeft: 12,
        gap: 16,
    },
    checkBox: {
        marginLeft: "5%",
    },
    loader: {
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgb(10, 10, 10)",
    },
    form: {
        marginTop: 26,
        height: "82%",
        width: "100%",
        justifyContent: "space-evenly",
        flexDirection: "column",
        alignItems: "center",
    },
    logo: {
        box: { alignItems: "center", gap: 26 },
        logoOutline: {
            borderWidth: 1,
            padding: 10,
            borderRadius: 10,
        },
        text: {
            fontWeight: 900,
            fontSize: 48,
        },
        textOutline: {
            paddingHorizontal: 17,
            paddingVertical: 4,
            borderWidth: 1,
            borderRadius: 10,
        },
    },
    input: {
        box: {
            width: "100%",
            paddingHorizontal: 20,
            borderRadius: 23,
        },
        cases: { gap: 20 },
        case: {
            borderRadius: 14,
            borderWidth: 0.8,
            paddingHorizontal: 14,
            paddingRight: 42, // 30(logo size)+12(right 12)
            fontSize: 16,
            overflow: "hidden",
        },
        logos: {
            justifyContent: "center",
        },
        icon: {
            right: 12,
            position: "absolute",
        },
    },

    button: {
        borderWidth: 1.4,

        borderRadius: 12,
        paddingVertical: 7,
        paddingHorizontal: 16,
    },

    infos: {
        position: "absolute",
        bottom: 20,
    },
    privacyPolicy: {
        maxWidth: 210,
        textAlign: "center",
    },
});

