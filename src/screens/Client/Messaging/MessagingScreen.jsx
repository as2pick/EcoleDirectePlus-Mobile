import moment from "moment";
import { useMemo, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomSheet from "../../../components/Layout/BottomSheet";
import { useTheme } from "../../../context/ThemeContext";

export default function MessagingScreen() {
    const { theme } = useTheme();
    const [selectedMessage, setSelectedMessage] = useState(null);

    // Mock data for messaging since resolver is empty
    const mockMessages = useMemo(() => [
        {
            id: 1,
            sender: "M. SALLE D.",
            subject: "Absence de professeur",
            preview: "Bonjour, je vous informe que le cours de mathématiques de demain...",
            date: moment().subtract(2, 'hours').toISOString(),
            unread: true
        },
        {
            id: 2,
            sender: "Mme MCCARTHY M.",
            subject: "Rendu de projet",
            preview: "N'oubliez pas de rendre votre projet d'anglais avant vendredi soir...",
            date: moment().subtract(1, 'days').toISOString(),
            unread: false
        },
        {
            id: 3,
            sender: "Vie Scolaire",
            subject: "Justification d'absence",
            preview: "Merci de bien vouloir justifier l'absence du 12/04/2026...",
            date: moment().subtract(3, 'days').toISOString(),
            unread: false
        }
    ], []);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: "rgb(12, 12, 32)" }]}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Messages</Text>
            </View>

            <FlatList
                data={mockMessages}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={[styles.messageCard, item.unread && styles.unreadCard]}
                        onPress={() => setSelectedMessage(item)}
                    >
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{item.sender[0]}</Text>
                        </View>
                        <View style={styles.messageDetails}>
                            <View style={styles.messageHeader}>
                                <Text style={[styles.sender, item.unread && styles.unreadText]}>{item.sender}</Text>
                                <Text style={styles.date}>{moment(item.date).fromNow()}</Text>
                            </View>
                            <Text style={[styles.subject, item.unread && styles.unreadText]} numberOfLines={1}>{item.subject}</Text>
                            <Text style={styles.preview} numberOfLines={2}>{item.preview}</Text>
                        </View>
                        {item.unread && <View style={styles.unreadDot} />}
                    </TouchableOpacity>
                )}
            />

            {selectedMessage && (
                <BottomSheet
                    displayLine
                    height="85%"
                    debateSpacing="0%"
                    movementDetectionHeight="15%"
                    style={{ backgroundColor: "rgb(25, 25, 56)", borderTopLeftRadius: 30, borderTopRightRadius: 30 }}
                >
                    <View style={styles.sheetContent}>
                        <Text style={styles.sheetSender}>{selectedMessage.sender}</Text>
                        <Text style={styles.sheetSubject}>{selectedMessage.subject}</Text>
                        <View style={styles.separator} />
                        <Text style={styles.sheetBody}>{selectedMessage.preview} (Contenu complet bientôt disponible)</Text>
                    </View>
                </BottomSheet>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 24,
        paddingVertical: 20,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: "bold",
        color: "white",
        fontFamily: "Luciole-Regular",
    },
    listContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    messageCard: {
        flexDirection: "row",
        backgroundColor: "rgba(255,255,255,0.03)",
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
    },
    unreadCard: {
        backgroundColor: "rgba(92, 113, 250, 0.1)",
        borderColor: "rgba(92, 113, 250, 0.3)",
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "rgb(50, 50, 87)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    avatarText: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },
    messageDetails: {
        flex: 1,
    },
    messageHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
    },
    sender: {
        color: "rgb(180, 180, 240)",
        fontSize: 14,
        fontWeight: "bold",
    },
    unreadText: {
        color: "white",
    },
    date: {
        color: "rgba(255,255,255,0.4)",
        fontSize: 12,
    },
    subject: {
        color: "rgb(180, 180, 240)",
        fontSize: 15,
        fontWeight: "bold",
        marginBottom: 4,
    },
    preview: {
        color: "rgba(255,255,255,0.5)",
        fontSize: 13,
        lineHeight: 18,
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#5C71FA",
        marginLeft: 10,
    },
    sheetContent: {
        padding: 24,
    },
    sheetSender: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 4,
    },
    sheetSubject: {
        color: "rgb(180, 180, 240)",
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
    },
    separator: {
        height: 1,
        backgroundColor: "rgba(255,255,255,0.1)",
        marginBottom: 20,
    },
    sheetBody: {
        color: "white",
        fontSize: 16,
        lineHeight: 24,
    }
});
