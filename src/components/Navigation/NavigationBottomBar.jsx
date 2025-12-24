// components/CustomNavbar.js
import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { addOpacityToCssRgb } from "../../utils/colorGenerator";

const NavigationBottomBar = ({ state, descriptors, navigation }) => {
    const [isPressedIn, setIsPressedIn] = useState(false);
    const [isLongPressed, setIsLongPressed] = useState(false);
    const { shadow, colors } = useTheme();
    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: addOpacityToCssRgb(colors.navbar, .95),
                    boxShadow: "0px 0px 10px 2px" + addOpacityToCssRgb("rgb(0, 0, 0)", shadow.oppacity),
                },
            ]}
        >
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                if (!options.inNavbar) return;
                const isFocused = state.index === index;
                const isHome = index === 2;

                const onPress = () => {
                    const event = navigation.emit({
                        type: "tabPress",
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };
                const IconComponent = options.icon;

                return (
                    <TouchableOpacity
                        key={index}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        onPress={onPress}
                        onPressIn={() => setIsPressedIn(true)}
                        onPressOut={() => {
                            setIsPressedIn(false);
                            setIsLongPressed(false);
                        }}
                        onLongPress={() => setIsLongPressed(true)}
                        style={styles.tab}
                    >
                        <View
                            style={[
                                styles.iconContainer,
                                isHome && isFocused && styles.homeIcon,
                                isFocused && { backgroundColor: colors.main },
                                !isHome && isFocused && styles.activeTab,
                            ]}
                        >
                            <IconComponent width={isHome && isFocused ? 47 : 40} height={isHome && isFocused ? 47 : 40} />
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignSelf: "center",
        alignItems: "center",
        padding: 14,
        paddingBottom: 20,
        borderRadius: 10,
        bottom: 0,
        position: "absolute",
        width: "100%",
        justifyContent: "space-around",
    },
    tab: {
        alignItems: "center",
        justifyContent: "center",
    },
    iconContainer: {
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    activeTab: {
        borderRadius: 12,
        padding: 6,
    },
    homeIcon: {
        marginTop: -20,
        width: 72,
        height: 72,
        borderRadius: 35,
        elevation: 5,
        zIndex: 10,
        padding: 6,
        boxShadow: "0px -3px 9px -5px " + "black",
    },
});

export default NavigationBottomBar;
