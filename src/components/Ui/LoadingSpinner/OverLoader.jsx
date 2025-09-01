import { useTheme } from "@react-navigation/native";
import { useEffect } from "react";
import Animated, {
    runOnJS,
    runOnUI,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import LoadingSpinner from "./Loader";

export default function OverLoader({
    annimationStartTiming, // in ms (1000 ex)
    bgOpacityValue, // float or int <1
    triggerStateArr, // to say "start visible process", "start not visible process"
    triggerViewArr, // to say "visible", "not visible"
    loaderStyles, // stylesheet -> object
    svgSize = 70,
}) {
    if (bgOpacityValue > 1 || typeof bgOpacityValue !== "number")
        console.error("OverLoader: 'bgOpacityValue' 0<=op<=1");

    const [triggerState, setTriggerState] = triggerStateArr;
    const [triggerView, setTriggerView] = triggerViewArr;

    const loadingOpacity = useSharedValue(0);
    const backgroundLoadingOpacity = useSharedValue(0);

    const loadingOpacityDynamicStyle = useAnimatedStyle(() => ({
        opacity: loadingOpacity.value,
    }));
    const backgroundLoadingOpacityDynamicStyle = useAnimatedStyle(() => ({
        backgroundColor: `rgba(10, 10, 10, ${backgroundLoadingOpacity.value})`,
    }));

    useEffect(() => {
        if (triggerState !== null) {
            if (triggerState) {
                setTriggerView(true);
                runOnUI(() => {
                    "worklet";
                    loadingOpacity.value = withTiming(1, {
                        duration: annimationStartTiming,
                    });
                    backgroundLoadingOpacity.value = withTiming(bgOpacityValue, {
                        duration: annimationStartTiming,
                    });
                })();
            } else {
                runOnUI(() => {
                    "worklet";
                    loadingOpacity.value = withTiming(0, {
                        duration: annimationStartTiming,
                    });
                    backgroundLoadingOpacity.value = withTiming(
                        0,
                        { duration: annimationStartTiming },
                        (finished) => {
                            if (finished) {
                                runOnJS(setTriggerView)(false);
                            }
                        }
                    );
                })();
            }
        }
        return () => setTriggerState(null);
    }, [triggerState]);

    const { colors } = useTheme();

    return (
        triggerView && (
            <Animated.View
                style={[loaderStyles, backgroundLoadingOpacityDynamicStyle]}
            >
                <Animated.View
                    style={[
                        loadingOpacityDynamicStyle,
                        {
                            backgroundColor: colors.bg.bg1,
                            borderRadius: 12,
                            padding: 8,
                            borderColor: colors.border,
                            borderWidth: 1.1,
                        },
                    ]}
                >
                    <LoadingSpinner size={svgSize} />
                </Animated.View>
            </Animated.View>
        )
    );
}

