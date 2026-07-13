import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
} from "react-native-reanimated";

export const ProgressBar = ({ progression, color = "auto" }) => {
    const animatedWidth = useSharedValue(0);

    useEffect(() => {
        animatedWidth.value = withDelay(
            100,
            withSpring(progression * 100, {
                damping: 40,
                stiffness: 100,
            })
        );
    }, [progression]);

    const animatedStyle = useAnimatedStyle(() => {
        let backgroundColor;

        if (color === "auto") {
            const hue = interpolate(animatedWidth.value, [0, 100], [0, 120]);
            backgroundColor = `hsl(${hue}, 100%, 50%)`;
        } else {
            backgroundColor = color;
        }

        return {
            width: `${animatedWidth.value}%`,
            backgroundColor,
        };
    });

    return (
        <View
            style={{
                marginHorizontal: 50,
                backgroundColor: "hsl(240, 15%, 33%)",
                borderRadius: 20,
            }}
        >
            <Animated.View
                style={[
                    {
                        height: 20,
                        borderRadius: 20,
                        alignItems: "flex-end",
                        justifyContent: "center",
                        paddingRight: 8,
                    },
                    animatedStyle,
                ]}
            />
        </View>
    );
};

