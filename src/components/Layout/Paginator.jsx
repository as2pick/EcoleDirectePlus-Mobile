import { useWindowDimensions, View } from "react-native";
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
} from "react-native-reanimated";

export default function Paginator({ data, scrollX }) {
    const { width } = useWindowDimensions();

    return (
        <View style={{ flexDirection: "row" }}>
            {data.map((_, i) => {
                const animatedDotStyle = useAnimatedStyle(() => {
                    const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

                    const dotWidth = interpolate(
                        scrollX.value,
                        inputRange,
                        [6, 18, 6],
                        Extrapolation.CLAMP
                    );

                    const opacity = interpolate(
                        scrollX.value,
                        inputRange,
                        [0.3, 1, 0.3],
                        Extrapolation.CLAMP
                    );

                    return {
                        width: dotWidth,
                        opacity,
                    };
                });

                return (
                    <Animated.View
                        style={[
                            {
                                height: 6,
                                borderRadius: 3,
                                marginHorizontal: 4,
                                backgroundColor: "green",
                            },
                            animatedDotStyle,
                        ]}
                        key={i.toString()}
                    />
                );
            })}
        </View>
    );
}

