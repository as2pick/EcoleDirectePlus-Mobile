import { StyleSheet, Text, View } from "react-native";
import { GLOBALS_DATAS } from "../constants/device/globals";
const {
    screen: { height, width },
} = GLOBALS_DATAS;

export default function RoundedBox({ course, boxColor }) {
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
        <View
            style={[
                styles.box,
                isCancelled && styles.cancelled,
                {
                    borderColor: boxColor,
                    backgroundColor: "rgb(242, 242, 242)",
                    width: width,
                },
            ]}
        >
            <View style={styles.content}>
                <Text style={[styles.title, { backgroundColor: boxColor }]}>
                    {libelle}
                </Text>
                <Text style={styles.teacher}>{teacher}</Text>
                <Text style={styles.room}>{room}</Text>
            </View>
            {isCancelled && <Text style={styles.cancelledText}>Cancelled</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    box: {
        padding: 7,
        marginVertical: 10,
        borderRadius: 10,

        elevation: 6,
        flexDirection: "column",
        justifyContent: "space-between",
        height: 70,
        position: "relative",
    },
    content: {
        flex: 1,

        position: "relative",
    },
    title: {
        fontSize: 18,
        position: "absolute",
        borderRadius: 6,
        padding: 4,
        top: 0,
        left: 0,
    },
    teacher: {
        bottom: 0,
        right: 0,
        position: "absolute",
        fontSize: 16,
        color: "gray",
    },
    room: {
        position: "absolute",
        top: 0,
        right: 0,
        fontSize: 14,
        fontWeight: "bold",
        color: "darkgray",
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

