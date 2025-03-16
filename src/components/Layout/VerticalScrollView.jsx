import React, { forwardRef, useImperativeHandle, useState } from "react";
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
import { GLOBALS_DATAS } from "../../constants/device/globals";

const {
    screen: { height },
} = GLOBALS_DATAS;

const VerticalScrollView = forwardRef(({ children, arrayLength, getIndex }, ref) => {
    const translateY = useSharedValue(0);
    const pageIndex = useSharedValue(0);
    const [activePageIndex, setActivePageIndex] = useState(0);

    useDerivedValue(() => {
        runOnJS(getIndex)(pageIndex.value);
    });

    const scrollToIndex = (index) => {
        if (index < 0 || index >= arrayLength) return;

        pageIndex.value = index;
        translateY.value = withSpring(-index * height, {
            stiffness: 100,
            damping: 15,
        });

        setActivePageIndex(index);
    };

    useImperativeHandle(ref, () => ({
        scrollToIndex,
    }));

    const gesture = Gesture.Pan()
        .onUpdate((event) => {
            translateY.value = withSpring(
                -pageIndex.value * height + event.translationY,
                {
                    stiffness: 225,
                    damping: 50,
                }
            );
        })
        .onEnd((event) => {
            let newIndex = pageIndex.value;
            if (event.translationY < -35 && newIndex < arrayLength - 1) {
                newIndex += 1;
            } else if (event.translationY > 35 && newIndex > 0) {
                newIndex -= 1;
            }

            runOnJS(scrollToIndex)(newIndex);
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
});

const styles = StyleSheet.create({
    container: { flex: 1 },
    page: { width: "100%", height },
});

export default VerticalScrollView;

