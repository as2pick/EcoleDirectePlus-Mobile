import Animated, {
    useAnimatedScrollHandler,
    useSharedValue,
} from "react-native-reanimated";
import Stack from "./Stack";

export default function ScrollableStack({
    children,
    horizontal = false,
    showsScrollIndicator = false,
    paging = false,
    contentContainerStyle,
    onScroll: externalOnScroll,
    ...props
}) {
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
            horizontal={horizontal}
            contentContainerStyle={[{}, contentContainerStyle]}
            showsVerticalScrollIndicator={showsScrollIndicator}
            showsHorizontalScrollIndicator={showsScrollIndicator}
            pagingEnabled={paging}
            onScroll={finalOnScroll}
            // scrollEnabled={false}
            scrollEventThrottle={16}
        >
            <Stack direction={horizontal ? "horizontal" : "vertical"} {...props}>
                {children}
            </Stack>
        </Animated.ScrollView>
    );
}

