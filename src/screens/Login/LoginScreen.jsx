import React, { useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import SelectableModal from "../../components/others/SelectableModal.jsx";
import { useLogin } from "../../context/LoginContext";
import { useUser } from "../../context/UserContext.jsx";
import Login from "../../services/login/authentication.js";
import { sendResponseChoice } from "../../services/login/doubleAuth.js";
import handleBase64 from "../../utils/handleBase64.js";

/** READ CAREFULLY COMMENTS !!!
 *
 * To do :
 * - Handle auto connection (when we open the app, we are autolog)
 * - Handle anwser error (in popup list)
 * - Handle bad login data (id, pswrd)
 */
export default function LoginScreen() {
    const {
        username,
        setUsername,
        password,
        isConnected,
        setPassword,
        setIsConnected,
        setLoginPayload,
    } = useLogin();
    const { setGlobalUserData } = useUser();

    const [loading, setLoading] = useState(false);
    const [doubleAuthData, setDoubleAuthData] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [encodedPropositionsArray, setEncodedPropositionsArray] = useState([]);
    const [connectionToken, setConnectionToken] = useState("");

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const handleLogin = async () => {
        // on press of Connect button
        if (!username || !password) {
            return;
        }
        setLoading(true);
        // empty payload for the demo account or to start A2F
        const sendCorrectPayload = {
            identifiant: encodeURIComponent(username),
            motdepasse: encodeURIComponent(password),
            isReLogin: false, // edit this in future
            cn: "",
            cv: "",
            uuid: 0,
            fa: [{ cn: "", cv: "" }],
        };
        const connectResponse = await Login(sendCorrectPayload);

        // check if we are directly connected (withoud A2F, just for demo account)

        switch (connectResponse.code) {
            // if we have code 200, we are connected, we have token and all account data
            case 200:
                setGlobalUserData(connectResponse);
                setIsConnected(true); // maybe useless
                setLoginPayload({
                    identifiant: encodeURIComponent(username),
                    motdepasse: encodeURIComponent(password),
                    isReLogin: false, // edit this in future
                    cn: "",
                    cv: "",
                    uuid: 0, // WHY ?
                    fa: [{ cn: "", cv: "" }],
                }); // DEBUGGING, useless beacause we didn't use "loginPayload"
                setLoading(false);
                break;
            // if we have code 250, A2F is engaged, so we request question and anwser
            case 250:
                setConnectionToken(connectResponse.token);
                setEncodedPropositionsArray(connectResponse.encodedPropositions);
                setDoubleAuthData(connectResponse.decodedData);

                toggleModal();
                setLoading(false);
                break;
            // here is bruh
            default:
                // error
                console.log("error bruh");
                break;
        }
    };

    const handleModalSubmit = async (item /* ex "mars" */) => {
        // check if re encoded selected data is correct
        if (encodedPropositionsArray.includes(handleBase64.encode(item))) {
            const cnCvResponse = await sendResponseChoice(connectionToken, item);
            switch (await cnCvResponse.code) {
                // if code is 200, the anwser is correct and we can new request Login
                case 200:
                    const cnCv = cnCvResponse.data;
                    const loginPayload = {
                        identifiant: encodeURIComponent(username),
                        motdepasse: encodeURIComponent(password),
                        isReLogin: false, // edit this in future
                        ...cnCv,
                        uuid: 0, // bruh, why ?
                        fa: [
                            {
                                ...cnCv,
                            },
                        ],
                    };
                    setLoginPayload(loginPayload); // DEBUGGING, useless beacause we didn't use "loginPayload"

                    // resend Login request with CN CV to get accound datas, token...
                    const connectResponse = await Login(loginPayload);
                    switch (connectResponse.code) {
                        // connected, we have all account datas
                        case 200:
                            setIsConnected(true); // maybe useless
                            setGlobalUserData(connectResponse);

                            break;
                        // error when sending cn cv...
                        default:
                            console.log("ERROR in resend Login");
                    }

                    break;
                // anwser is not correct, bad (handle this in future)
                case 505:
                    // error, invalid anwser
                    console.log("error, invalid anwser !");
                    break;
            }
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={(text) => setUsername(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry
            />

            <TouchableOpacity
                onPress={handleLogin}
                style={{
                    backgroundColor: isConnected ? "#0F0" : "#46e",
                    padding: 10,
                    borderRadius: 5,
                    textAlign: "center",
                }}
                disabled={loading}
            >
                <Text>{isConnected ? "Connected" : "Connect"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    setIsConnected(false);
                    setLoginPayload(""); // really important (more complex with auto connection)
                }}
                style={{
                    backgroundColor: "#f00",
                    top: "20",
                    padding: 10,
                    borderRadius: 5,
                    textAlign: "center",
                }}
            >
                <Text>DISCONECT (temporaire)</Text>
            </TouchableOpacity>
            {loading && <ActivityIndicator size="large" color="#B1B1B1" />}

            <SelectableModal
                visible={modalVisible}
                onClose={toggleModal}
                items={doubleAuthData?.propositions}
                onSelect={handleModalSubmit}
                question={doubleAuthData?.question}
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

