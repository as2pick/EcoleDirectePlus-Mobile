import { useRef } from "react";
import { StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";
import OnboardingItem from "./OnboardingItem";
import Paginator from "./Paginator";

export default function Onboarding({ data }) {
    const scrollX = useSharedValue(0);
    const slidesRef = useRef(null);
    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const onScroll = (event) => {
        scrollX.value = event.nativeEvent.contentOffset.x;
    };

    const viewabilityConfigCallbackPairs = useRef([
        {
            viewabilityConfig: viewConfig,
        },
    ]);

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={({ item }) => <OnboardingItem item={item} />}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                bounces={false}
                keyExtractor={(item, i) => i.toString()}
                onScroll={onScroll}
                scrollEventThrottle={16}
                ref={slidesRef}
                viewabilityConfigCallbackPairs={
                    viewabilityConfigCallbackPairs.current
                }
                style={styles.flatList}
            />

            <View style={styles.paginatorOverlay}>
                <Paginator data={data} scrollX={scrollX} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    flatList: {
        flex: 1,
        width: "100%",
    },
    paginatorOverlay: {
        position: "absolute",
        bottom: "20%",
        left: 0,
        right: 0,
        alignItems: "center",
    },
});

