import { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import SimpleArrow from "../../../assets/svg/SimpleArrow";

export default function CustomDropdown({
    options = [
        { label: "Trimestre 1", value: "A001" },
        { label: "Trimestre 2", value: "A002" },
        { label: "Trimestre 3", value: "A003" },
    ],
    placeholder = "Choisis une période",
    onSelect = () => {},
}) {
    const [selected, setSelected] = useState(null);
    const [open, setOpen] = useState(false);

    const progress = useSharedValue(0); // 0 = fermé, 1 = ouvert

    const toggleDropdown = () => {
        setOpen((prev) => !prev);
        progress.value = withTiming(open ? 0 : 1, { duration: 200 });
    };

    const handleSelect = (item) => {
        setSelected(item);
        setOpen(false);
        progress.value = withTiming(0, { duration: 200 });
        onSelect(item.value);
    };

    const dropdownStyle = useAnimatedStyle(() => ({
        opacity: progress.value,
        transform: [{ scaleY: progress.value }],
        height: interpolate(progress.value, [0, 1], [0, options.length * 50]), // option height = 50
    }));

    const arrowStyle = useAnimatedStyle(() => ({
        transform: [
            { rotate: `${interpolate(progress.value, [0, 1], [0, 90])}deg` },
        ],
    }));

    return (
        <View style={styles.container}>
            {/* Bouton principal */}
            <TouchableOpacity
                onPress={toggleDropdown}
                activeOpacity={0.8}
                style={styles.button}
            >
                <View style={styles.buttonContent}>
                    <Animated.View style={arrowStyle}>
                        <SimpleArrow />
                    </Animated.View>
                    <Text style={styles.buttonText}>
                        {selected ? selected.label : placeholder}
                    </Text>
                </View>
            </TouchableOpacity>

            {/* Liste déroulante */}
            <Animated.View style={[styles.dropdown, dropdownStyle]}>
                <FlatList
                    data={options}
                    keyExtractor={(item) => item.value}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.option}
                            onPress={() => handleSelect(item)}
                        >
                            <SimpleArrow />
                            <Text style={styles.optionText}>{item.label}</Text>
                        </TouchableOpacity>
                    )}
                />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { width: 220, alignItems: "center" },
    button: {
        backgroundColor: "hsl(240, 30%, 20%)",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: "hsl(240, 25%, 40%)",
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: { color: "white", fontSize: 16, marginLeft: 8 },
    dropdown: {
        marginTop: 8,
        backgroundColor: "hsl(240, 35%, 15%)",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "hsl(240, 25%, 40%)",
        overflow: "hidden",
        width: "100%",
    },
    option: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 14,
    },
    optionText: { color: "white", marginLeft: 8, fontSize: 15 },
});

