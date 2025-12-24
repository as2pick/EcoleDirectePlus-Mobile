import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View, useWindowDimensions } from "react-native";
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
    const { colors, shadow } = useTheme();
    const styles = createStyles(colors, shadow);
    const progress = useSharedValue(0);
    const contentWidth = useSharedValue(0);
    const { width: windowWidth } = useWindowDimensions();

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

    const containerStyle = useAnimatedStyle(() => {
        const minWidth = contentWidth.value + 36; // Content + padding
        const maxWidth = windowWidth * 0.58;

        return {
            height: interpolate(
                progress.value,
                [0, 1],
                [50, 50 + Math.min(options.length * 40, 150)] // Base height + list height
            ),
            width: contentWidth.value === 0
                ? undefined
                : interpolate(progress.value, [0, 1], [minWidth, maxWidth]),
            backgroundColor: addOpacityToCssRgb(colors.background.gradient, interpolate(progress.value, [0, 1], [0.4, 0.8])),
            borderRadius: 20, // Keep rounded corners
            borderColor: "hsla(240, 14%, 18%, .98)",
            //borderWidth: 1, // Optional: if you want a border
        };
    });

    const arrowStyle = useAnimatedStyle(() => ({
        transform: [
            { rotate: `${interpolate(progress.value, [0, 1], [0, 180])}deg` },
        ],
    }));

    return (
        <Animated.View style={[styles.container, containerStyle]}>
            <TouchableOpacity onPress={toggleDropdown} activeOpacity={0.8} style={styles.headerButton}>
                <View
                    style={styles.buttonContent}
                    onLayout={(e) => {
                        contentWidth.value = e.nativeEvent.layout.width;
                    }}
                >
                    <Animated.View style={arrowStyle}>
                        <SimpleArrow fill={colors.contrast} />
                    </Animated.View>

                    <Text style={styles.buttonText}>
                        {selected ? selected.label : options[0].label}
                    </Text>
                </View>
            </TouchableOpacity>

            <ScrollView nestedScrollEnabled style={styles.scrollView}>
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
    );
}

const createStyles = (colors, shadow) => StyleSheet.create({
    container: {
        //width: "58%",
        alignSelf: "center",
        overflow: "hidden",
        alignItems: "center",
        paddingBottom: 12,
        boxShadow: "1px 1px 7px 0px " + addOpacityToCssRgb("rgb(0, 0, 0)", shadow.oppacity),
    },
    headerButton: {
        width: "100%",
        height: 50, // Fixed height for the header part
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 18,
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: { marginLeft: 8, color: colors.contrast },
    scrollView: {
        width: "100%",
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

