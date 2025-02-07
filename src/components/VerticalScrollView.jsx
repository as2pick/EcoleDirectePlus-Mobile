import React from "react";
import { StyleSheet, View } from "react-native";
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { GLOBALS_DATAS } from "../constants/device/globals";

const {
    screen: { height },
} = GLOBALS_DATAS;

export default function VerticalScrollView({ children, arrayLength, getIndex }) {
    const translateY = useSharedValue(0);
    const pageIndex = useSharedValue(0);

    useDerivedValue(() => {
        runOnJS(getIndex)(pageIndex.value);
    });

    // Gestion du swipe vertical
    const gesture = Gesture.Pan()
        .onUpdate((event) => {
            translateY.value = -pageIndex.value * height + event.translationY;
        })
        .onEnd((event) => {
            let newIndex = pageIndex.value;

            if (event.translationY < -25 && newIndex < arrayLength - 1) {
                newIndex += 1;
            } else if (event.translationY > 25 && newIndex > 0) {
                newIndex -= 1;
            }

            pageIndex.value = newIndex;
            translateY.value = withSpring(-newIndex * height, {
                stiffness: 100,
                damping: 15,
            });
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <GestureDetector gesture={gesture}>
                <Animated.View style={[styles.container, animatedStyle]}>
                    {React.Children.map(children, (child, index) => (
                        <View key={index} style={styles.page}>
                            {child}
                        </View>
                    ))}
                </Animated.View>
            </GestureDetector>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    page: { width: "100%", height: height },
});

