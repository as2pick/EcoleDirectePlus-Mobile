import { useNavigation, useTheme } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AccountIcon from "../../../../assets/svg/AccountIcon.jsx";
import DiscordLogo from "../../../../assets/svg/DiscordLogo.jsx";
import EDPLogo from "../../../../assets/svg/EDPLogo.jsx";
import GithubLogo from "../../../../assets/svg/GithubLogo.jsx";
import KeyIcon from "../../../../assets/svg/KeyIcon.jsx";
import {
    A2fSelectableModal,
    CheckBox,
    LinkButton,
    OverLoader,
} from "../../../components/index.js";

import { getApiMessage } from "../../../constants/api/codes.js";
import { useSingIn } from "../../../context/SignInContext.jsx";
import { routesNames } from "../../../router/config/routesNames.js";
import { addOpacityToCssRgb } from "../../../utils/colorGenerator";

export default function LoginScreen() {
    const navigation = useNavigation();
    const theme = useTheme();
    const caseColor = addOpacityToCssRgb(theme.colors.case, 0.3);
    const styles = createStyles(theme, caseColor); //Temporary
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

    return (
        <SafeAreaView style={[styles.container]}>
            <SafeAreaView style={styles.logos}>
                <LinkButton url={"https://discord.gg/AKAqXfTgvE"}>
                    <DiscordLogo fill={theme.colors.main} size={28} />
                </LinkButton>

                <LinkButton
                    url={"https://github.com/as2pick/EcoleDirectePlus-Mobile"}
                >
                    <GithubLogo fill={theme.colors.main} size={28} />
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
                    <Text style={[styles.logo.text]}>Connexion</Text>
                </View>
                <View style={[styles.input.box]}>
                    <View style={styles.input.cases}>
                        <View style={styles.input.logos}>
                            <TextInput
                                placeholder="Identifiant"
                                placeholderTextColor={theme.colors.main}
                                onChangeText={(data) => {
                                    setApiError(null);
                                    setUsername(data);
                                }}
                                value={username}
                                style={[styles.input.case]}
                            />
                            <View style={styles.input.icon}>
                                <AccountIcon />
                            </View>
                        </View>
                        <View style={styles.input.logos}>
                            <TextInput
                                placeholder="Mot de passe"
                                placeholderTextColor={theme.colors.main}
                                onChangeText={(data) => {
                                    setApiError(null);
                                    setPassword(data);
                                }}
                                value={password}
                                secureTextEntry
                                style={[styles.input.case]}
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
                    style={styles.buttonWrapper}
                >
                    <LinearGradient
                        colors={[theme.colors.main, theme.colors.accent]}
                        start={{ x: 0.0, y: 1.0 }}
                        end={{ x: 1.0, y: 0.0 }}
                        style={styles.gradientStyle}
                    >
                        <Text style={styles.button}>{"Se connecter      ➜"}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
            {apiError && <Text style={styles.error}>{apiError}</Text>}
            <View style={styles.infos}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate(routesNames.auth.privacyPolicy);
                    }}
                >
                    <Text style={[styles.privacyPolicy]}>
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

const createStyles = (theme, caseColor) =>
    StyleSheet.create({
        //const styles = StyleSheet.create({ - Temporary
        container: {
            flex: 1,
            alignItems: "center",
            backgroundColor: theme.colors.background.login,
        },
        logos: {
            flexDirection: "row",
            position: "absolute",
            top: 12,
            left: 8,
            marginLeft: 12,
            gap: 16,
            color: theme.colors.main,
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
                color: theme.colors.accent,
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
                paddingHorizontal: 17,
                paddingRight: 42, // 30(logo size)+12(right 12)
                fontSize: 16,
                overflow: "hidden",
                borderColor: theme.colors.accent,
                color: theme.colors.main,
                backgroundColor: caseColor,
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
            //borderWidth: 1,
            //borderColor: theme.colors.accent,
            //transform: [{ scale: 1.2 }],
            borderRadius: 12,
            paddingVertical: 7,
            paddingHorizontal: 16,
            color: theme.colors.theme,
            //backgroundColor: theme.colors.accent,
        },
        buttonWrapper: {
            borderRadius: 12,
            overflow: "hidden",
            transform: [{ scale: 1.2 }],
        },

        infos: {
            position: "absolute",
            bottom: 20,
        },
        privacyPolicy: {
            maxWidth: 210,
            textAlign: "center",
            color: theme.colors.main,
        },
        error: {
            color: theme.colors.error,
            padding: 12,
            backgroundColor: theme.colors.bg.bg2,
            borderColor: theme.colors.error,
            borderWidth: 0.9,
            borderRadius: 12,
        },
        gradientStyle: {
            paddingVertical: 0,
            paddingHorizontal: 0,
            justifyContent: "center",
            alignItems: "center",
        },
    });

