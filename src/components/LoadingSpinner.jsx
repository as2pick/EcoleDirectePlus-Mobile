import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
    Easing,
    useAnimatedProps,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const LoadingSpinner = () => {
    const rotateValue = useSharedValue(0);

    const animatedProps = useAnimatedProps(() => {
        return {
            transform: [
                { translateX: 50 },
                { translateY: 50 },
                { rotate: `${rotateValue.value}deg` },
                { translateX: -50 },
                { translateY: -50 },
            ],
        };
    });

    useEffect(() => {
        rotateValue.value = withRepeat(
            withTiming(360, { duration: 1200, easing: Easing.linear }),
            -1,
            false
        );
    }, [rotateValue]);

    return (
        <View>
            <Svg height="100" width="100" viewBox="0 0 100 100">
                <AnimatedCircle
                    animatedProps={animatedProps}
                    cx="50"
                    cy="50"
                    r="32"
                    fill="none"
                    stroke="white"
                    strokeWidth="8"
                    strokeDasharray="50.26548245743669 50.26548245743669"
                    strokeLinecap="round"
                />
            </Svg>
        </View>
    );
};

export default LoadingSpinner;

