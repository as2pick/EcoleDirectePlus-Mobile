import React, { useState } from "react";
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
    const [activePageIndex, setActivePageIndex] = useState(0);
    let isCatched = false;

    useDerivedValue(() => {
        runOnJS(getIndex)(pageIndex.value);
    });

    const gesture = Gesture.Pan()
        .onUpdate((event) => {
            if (
                event.translationY > 0 && // up swipe (< 0 -> down ; > 0 -> up)
                activePageIndex + 1 !== arrayLength - 1 && // check page index (if not at end or start)
                activePageIndex === 0 // check if we are at first index  (last element)
            ) {
                if (event.translationY > 800) {
                    translateY.value = translateY.value;
                }
                translateY.value = withSpring(event.translationY * 0.2, {
                    stiffness: 200,
                    damping: 20,
                });
            } else if (
                event.translationY < 0 && // down swipe (< 0 -> down ; > 0 -> up)
                activePageIndex + 1 !== arrayLength - 1 && // check page index (if not at end or start)
                activePageIndex === arrayLength - 1 // check if we are at least index (last element)
            ) {
                if (event.translationY < -800) {
                    translateY.value = translateY.value;
                }
                translateY.value = withSpring(
                    -pageIndex.value * height + event.translationY * 0.2,
                    {
                        stiffness: 200,
                        damping: 20,
                    }
                );
            } else {
                translateY.value = withSpring(
                    -pageIndex.value * height + event.translationY,
                    {
                        stiffness: 225,
                        damping: 50,
                    }
                );
            }
        })
        .onEnd((event) => {
            let newIndex = pageIndex.value;

            if (event.translationY < -50 && newIndex < arrayLength - 1) {
                newIndex += 1;
            } else if (event.translationY > 50 && newIndex > 0) {
                newIndex -= 1;
            }

            pageIndex.value = newIndex;
            translateY.value = withSpring(-newIndex * height, {
                stiffness: 100,
                damping: 15,
            });

            runOnJS(setActivePageIndex)(newIndex);
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
    page: { width: "100%", height },
});

