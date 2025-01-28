import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import SelectableModal from "../../components/others/SelectableModal.jsx";
import { getApiMessage } from "../../constants/api/codes.js";
import { useSingIn } from "../../context/SignInContext.jsx";

/** READ CAREFULLY COMMENTS !!!
 * - Handle auto connection (when we open the app, we are autolog)
 * - Handle anwser error (in popup list)
 * - Handle bad login data (id, pswrd)
 */
export default function LoginScreen() {
    const { signIn, mcqDatas, setChoice, setMcqDatas, signOut } = useSingIn();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [loginStates, setLoginStates] = useState({
        loading: false,

        decodedChoices: [],
        decodedQuestion: null,
    });

    const toggleModal = useCallback(() => {
        setModalVisible((lastState) => !lastState);
    }, []);

    // outdated token ca87873a-984a-4568-a1b6-41222bb7fc25
    const handleModalSubmit = async (item) => {
        setChoice(mcqDatas.choices[item]);

        setMcqDatas("");
    };
    // on mcqDatas
    useEffect(() => {
        if (!mcqDatas) return;

        if (!"choices" && (!"question") in mcqDatas) {
            const message = getApiMessage(1005);
            // provoquer une erreur avec le screen d'error (not implemented yet)
        }

        setLoginStates((prevState) => ({
            ...prevState,
            decodedChoices: [...Object.keys(mcqDatas.choices)],
            decodedQuestion: [...Object.keys(mcqDatas.question)[0]],
        }));
        toggleModal();
    }, [mcqDatas]);

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity
                onPress={() => signIn({ username, password })}
                style={{
                    backgroundColor: "#0F0",
                    padding: 10,
                    borderRadius: 5,
                    textAlign: "center",
                }}
                disabled={loginStates.loading}
            >
                <Text>{"Connect"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={signOut}
                style={{
                    backgroundColor: "#f00",
                    top: "20",
                    padding: 10,
                    borderRadius: 5,
                    textAlign: "center",
                }}
            >
                <Text>DISCONECT (temporary)</Text>
            </TouchableOpacity>

            {loginStates.loading && (
                <ActivityIndicator size="large" color="#B1B1B1" />
            )}
            <SelectableModal
                visible={modalVisible}
                onClose={toggleModal}
                items={loginStates.decodedChoices}
                onSelect={handleModalSubmit}
                question={loginStates.decodedQuestion}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    error: {
        color: "red",
        marginBottom: 12,
    },
    button: {},
    buttonText: {
        color: "#fff",
        fontSize: 16,
    },
});

