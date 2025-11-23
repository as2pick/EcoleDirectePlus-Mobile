import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import SimpleArrow from "../../../assets/svg/SimpleArrow";
import Text from "../Ui/core/Text";
import { addOpacityToCssRgb } from "../../utils/colorGenerator";

export default function CustomDropdown({
    options = [
        { label: "Trimestre 1", value: "A001" },
        { label: "Trimestre 2", value: "A002" },
        { label: "Trimestre 3", value: "A003" },
    ],
    onSelect = () => { },
}) {
    const [selected, setSelected] = useState(null);
    const [open, setOpen] = useState(false);
    const { colors } = useTheme();
    const styles = createStyles(colors)
    const progress = useSharedValue(0);

    const toggleDropdown = () => {
        const next = !open;
        setOpen(next);
        progress.value = withTiming(next ? 1 : 0, { duration: 200 });
    };

    const handleSelect = (item) => {
        setSelected(item);
        setOpen(false);
        progress.value = withTiming(0, { duration: 200 });
        onSelect(item.value);
    };

    const dropdownStyle = useAnimatedStyle(() => ({
        opacity: progress.value,
        height: Math.min(
            interpolate(progress.value, [0, 1], [0, options.length * 50]),
            150
        ),
        borderRadius: interpolate(progress.value, [0, 1], [0, 20]),
    }));

    const arrowStyle = useAnimatedStyle(() => ({
        transform: [
            { rotate: `${interpolate(progress.value, [0, 1], [0, 180])}deg` },
        ],
    }));

    const buttonAnimatedStyle = useAnimatedStyle(() => ({
        borderBottomLeftRadius: interpolate(progress.value, [0, 1], [20, 0]),
        borderBottomRightRadius: interpolate(progress.value, [0, 1], [20, 0]),
        borderTopLeftRadius: interpolate(progress.value, [0, 1], [10, 20]),
        borderTopRightRadius: interpolate(progress.value, [0, 1], [10, 20]),
        paddingTop: interpolate(progress.value, [0, 1], [8, 10]),
        borderColor: "hsla(240, 14%, 18%, .98)",
        //backgroundColor: `rgba(0, 0, 0, ${interpolate(progress.value, [0, 1], [0.3, 0.6])})`,
        backgroundColor: addOpacityToCssRgb(colors.background.gradient, interpolate(progress.value, [0, 1], [0.4, 0.8])),
    }));

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.button, buttonAnimatedStyle]}>
                <TouchableOpacity onPress={toggleDropdown} activeOpacity={0.8}>
                    <View style={styles.buttonContent}>
                        <Animated.View style={arrowStyle}>
                            <SimpleArrow fill={colors.contrast} />
                        </Animated.View>

                        <Text style={styles.buttonText}>
                            {selected ? selected.label : options[0].label}
                        </Text>
                    </View>
                </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[styles.dropdown, dropdownStyle]}>
                <ScrollView nestedScrollEnabled>
                    {options.map((item) => (
                        <TouchableOpacity
                            key={item.value}
                            style={styles.option}
                            onPress={() => handleSelect(item)}
                        >
                            <Text style={styles.optionText} oneLine>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </Animated.View>
        </View>
    );
}

const createStyles = (colors) => StyleSheet.create({
    container: { width: "58%", maxHeight: 170, alignItems: "center" },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 18,
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: { marginLeft: 8, color: colors.contrast },
    dropdown: {
        overflow: "hidden",
        width: "100%",
        backgroundColor: colors.background.gradient,
        paddingVertical: 10,
    },
    option: {
        alignItems: "center",
        marginVertical: 4,
        borderRadius: 5,
        marginHorizontal: 12,
        paddingVertical: 5,
        backgroundColor: colors.secondary,
    },
    optionText: { flexShrink: 1 },
});

