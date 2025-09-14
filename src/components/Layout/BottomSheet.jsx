import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

export default function BottomSheet({
    children,
    displayLine = false,
    height = "95%",
    debateSpacing = "30%",
    movementDetectionHeight = "40%",
    style = {},
}) {
    debateSpacing = Number(debateSpacing.replace("%", ""));

    const [isUp, setIsUp] = useState(false);
    const [usableHeight, setUsableHeight] = useState(0);

    const translateY = useSharedValue(debateSpacing); // percents
    const previousY = useSharedValue({ y: 0 }); // in pixels
    const togglePosition = () => {
        translateY.value = withTiming(isUp ? debateSpacing : 0, {
            duration: 250,
            easing: Easing.out(Easing.cubic),
        });
        setIsUp(!isUp);
    };

    const gesure = Gesture.Pan()
        .onStart(() => {
            previousY.value = { y: (translateY.value * usableHeight) / 100 };
            // set previousY. convert translateY from % to pixels
        })
        .onUpdate((event) => {
            translateY.value =
                ((event.translationY + previousY.value.y) * 100) / usableHeight;
            // set translateY. integrate previousY (in pixels) + actual translation (in pixels). convert to %
            translateY.value = Math.max(translateY.value, 0);
            translateY.value = Math.min(translateY.value, debateSpacing);
        })
        .onEnd((event) => {
            if (event.velocityY >= 900 && isUp) {
                scheduleOnRN(togglePosition);
            } else if (event.velocityY <= -900 && !isUp) {
                scheduleOnRN(togglePosition);
            } else if (
                translateY.value > debateSpacing / 2 &&
                translateY.value < debateSpacing
            ) {
                scheduleOnRN(togglePosition);
            } else if (
                translateY.value < debateSpacing / 2 &&
                translateY.value > 0
            ) {
                scheduleOnRN(togglePosition);
            } else if (translateY.value >= debateSpacing && isUp) {
                scheduleOnRN(setIsUp, false);
            } else if (translateY.value <= 0 && !isUp) {
                scheduleOnRN(setIsUp, true);
            }
        });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: (translateY.value * usableHeight) / 100 }],
        };
    });

    return (
        <View
            style={styles.container}
            onLayout={(e) => setUsableHeight(e.nativeEvent.layout.height)}
        >
            <Animated.View
                style={[
                    styles.slidingView,
                    { height: height },
                    style,
                    animatedStyle,
                ]}
            >
                <GestureDetector gesture={gesure}>
                    <View
                        style={[
                            styles.detectionArea,
                            { height: movementDetectionHeight },
                        ]}
                    />
                </GestureDetector>
                {displayLine && (
                    <View
                        style={{
                            alignItems: "center",
                            marginTop: 24,
                        }}
                    >
                        <View
                            style={{
                                width: 35,
                                height: 6,
                                borderRadius: 10,
                                backgroundColor: "white",
                            }}
                        />
                    </View>
                )}
                {children}
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    detectionArea: {
        position: "absolute",
        flex: 1,
        width: "100%",
        alignSelf: "center",
    },

    slidingView: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
    },
});

