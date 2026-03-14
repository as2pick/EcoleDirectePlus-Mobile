import { forwardRef } from "react";
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue,
} from "react-native-reanimated";
import Stack from "./Stack";

const ScrollableStack = forwardRef(function ScrollableStack({
    children,
    horizontal = false,
    showsScrollIndicator = false,
    paging = false,
    contentContainerStyle,
    onScroll: externalOnScroll,
    ...props
}, ref) {
    const scrollX = useSharedValue(0);
    const internalOnScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = horizontal
                ? event.contentOffset.x
                : event.contentOffset.y;
        },
    });

    const finalOnScroll = externalOnScroll || internalOnScroll;

    return (
        <Animated.ScrollView
            ref={ref}
            horizontal={horizontal}
            contentContainerStyle={[{}, contentContainerStyle]}
            showsVerticalScrollIndicator={showsScrollIndicator}
            showsHorizontalScrollIndicator={showsScrollIndicator}
            pagingEnabled={paging}
            onScroll={finalOnScroll}
            scrollEventThrottle={16}
        >
            <Stack direction={horizontal ? "horizontal" : "vertical"} {...props}>
                {children}
            </Stack>
        </Animated.ScrollView>
    );
});

export default ScrollableStack;
