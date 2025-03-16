import { StyleSheet, View } from "react-native";

export const Separation = () => {
    const { colors } = useTheme();
    return (
        <View style={styles.separationParent}>
            <View
                style={[
                    styles.separationChildren,
                    { backgroundColor: colors.txt.txt1 },
                ]}
            />
        </View>
    );
};
const styles = StyleSheet.create({
    title: {
        fontSize: 26,
        fontWeight: 600,
        marginLeft: 20,
    },
    scrollview: {
        paddingBottom: 32,
    },
    subtitle: {
        fontWeight: 600,
        fontSize: 18,
        marginLeft: 20,
    },
    paragraph: {
        marginLeft: 30,
        marginRight: 20,
        marginVertical: 4,
    },
    separationParent: {
        alignItems: "center",
        marginVertical: 14,
    },
    separationChildren: {
        width: "92%",
        height: 1.8,
        borderRadius: 999,
        marginLeft: 30,
        marginRight: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "center",
        paddingVertical: 10,
        marginHorizontal: 5,
        position: "relative",
    },
});

