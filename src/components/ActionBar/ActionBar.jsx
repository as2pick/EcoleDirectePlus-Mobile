import { StyleSheet, View, TouchableOpacity } from "react-native";
import { useTheme, useNavigationState, useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import Animated, { useSharedValue, interpolate, withTiming, useAnimatedStyle } from "react-native-reanimated";
import { addOpacityToCssRgb } from "../../utils/colorGenerator";
import LottieView from "lottie-react-native";
import { useActionBar } from "../../context/ActionBarContext";
import MenuDotsIcon from "../../../assets/svg/ActionBar/Icon";

const ActionBar = () => {
    //const { theme } = useTheme();
    const { colors, shadow } = useTheme();
    const styles = createStyles(colors, shadow);
    const [isPressed, setIsPressed] = useState(false);
    const { actions, updateActions } = useActionBar();
    const progress = useSharedValue(0);
    const visibility = useSharedValue(actions.length > 0 ? 1 : 0);

    useEffect(() => {
        visibility.value = withTiming(actions.length > 0 ? 1 : 0, { duration: 300 });
        if (actions.length === 0) {
            setIsPressed(false);
            progress.value = withTiming(0, { duration: 200 });
        }
    }, [actions]);

    const toggle = () => {
        if (actions.length === 0) return;
        const next = !isPressed;
        setIsPressed(next);
        progress.value = withTiming(next ? 1 : 0, { duration: 200 });
    };

    const animatedStyle = useAnimatedStyle(() => {
        const expandedHeight = actions.length > 0 ? (actions.length * 41) + 60 : 50;
        return {
            height: interpolate(progress.value, [0, 1], [50, expandedHeight]),
            borderRadius: interpolate(progress.value, [0, 1], [25, 23]),
            opacity: visibility.value,
        };
    });

    return (
        <>
            <Animated.View
                style={[styles.container, animatedStyle]}
            >
                <LottieView
                    source={require("../../../assets/json/lottie/canardman_walking.json")}
                    autoPlay
                    loop
                    style={styles.canardman}
                />

                {isPressed && (
                    <View style={styles.actionsContainer}>
                        {actions.map((action, index) => {
                            const Icon = action.icon;
                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={action.onPress}
                                    style={styles.actionButton}
                                >
                                    <Icon width={30} height={30} stroke={colors.main} />
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}

                <TouchableOpacity
                    onPress={toggle}
                    style={styles.button}
                >
                    <MenuDotsIcon width={30} height={30} fill={isPressed ? colors.main : "white"} />
                </TouchableOpacity>
            </Animated.View>
        </>
    );
};

const createStyles = (colors, shadow) => StyleSheet.create({
    container: {
        position: "absolute",
        right: 25,
        bottom: 110,
        backgroundColor: colors.navbar,
        padding: 7,
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
        borderRadius: 23,
        width: 52,
        boxShadow: "0px 0px 10px 2px " + addOpacityToCssRgb("rgb(0, 0, 0)", shadow.oppacity),
    },
    button: {
        width: 35,
        height: 35,
        borderRadius: 50,
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "center",
    },
    actionsContainer: {
        flex: 1,
        width: "100%",
        paddingBottom: 10,
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 4,
    },
    actionButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    canardman: {
        width: 50,
        height: 50,
        position: "absolute",
        top: -43,
    },
});

export default ActionBar;

