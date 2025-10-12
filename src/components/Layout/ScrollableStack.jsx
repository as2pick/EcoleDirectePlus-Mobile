import Animated, {
    useAnimatedScrollHandler,
    useSharedValue,
} from "react-native-reanimated";
import Stack from "./Stack";

export default function ScrollableStack({
    horizontal = false,
    showsScrollIndicator = false,
    paging = false,
    contentContainerStyle,
    children,
    ...props
}) {
    const scrollX = useSharedValue(0);

    const onScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = horizontal
                ? event.contentOffset.x
                : event.contentOffset.y;
        },
    });

    return (
        <Animated.ScrollView
            horizontal={horizontal}
            contentContainerStyle={[{}, contentContainerStyle]}
            showsVerticalScrollIndicator={showsScrollIndicator}
            showsHorizontalScrollIndicator={showsScrollIndicator}
            pagingEnabled={paging}
            onScroll={onScroll}
            scrollEventThrottle={16} // important pour bien rafraîchir les valeurs
        >
            <Stack direction={horizontal ? "horizontal" : "vertical"} {...props}>
                {children}
            </Stack>
        </Animated.ScrollView>
    );
}

