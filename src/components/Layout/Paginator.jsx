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
                        [10, 20, 10],
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
                                height: 10,
                                borderRadius: 5,
                                marginHorizontal: 8,
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

