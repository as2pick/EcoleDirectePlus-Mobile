import { StyleSheet, Text, View } from "react-native";
import { GLOBALS_DATAS } from "../constants/device/globals";
const {
    screen: { height, width },
} = GLOBALS_DATAS;

export default function RoundedBox({ course }) {
    const {
        classGroup,
        endCourse,
        group,
        isCancelled,
        isDispensed,
        isEdited,
        libelle,
        room,
        startCourse,
        teacher,
        webId,
    } = course;

    return (
        <View style={[styles.box, isCancelled && styles.cancelled]}>
            <View style={styles.content}>
                <Text style={styles.title}>{libelle}</Text>
                <Text style={styles.teacher}>{teacher}</Text>
            </View>
            <Text style={styles.room}>{room}</Text>
            {isCancelled && <Text style={styles.cancelledText}>Cancelled</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    box: {
        backgroundColor: "rgb(230, 230, 230)",
        padding: 16,
        borderRadius: 10,
        borderWidth: 0.8,
        borderColor: "rgb(212, 212, 212)",
        elevation: 10,
        flexDirection: "column",
        justifyContent: "space-between",
        height: 70,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 18,
    },
    teacher: {
        fontSize: 16,
        color: "gray",
    },
    room: {
        fontSize: 14,
        color: "darkgray",
        alignSelf: "flex-end",
    },
    cancelled: {
        backgroundColor: "rgb(255, 230, 230)",
        borderColor: "rgb(255, 180, 180)",
    },
    cancelledText: {
        color: "red",
        fontWeight: "bold",
        alignSelf: "flex-end",
        position: "absolute",
    },
});

