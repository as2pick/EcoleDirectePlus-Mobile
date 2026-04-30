// components/CustomNavbar.js
import { useTheme } from "@react-navigation/native";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { CONFIG } from "../../constants/config";

const NavigationBottomBar = ({ state, descriptors, navigation }) => {
    const { colors } = useTheme();

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: colors.navbar.background,
                    borderTopColor: colors.navbar.border,
                    borderTopWidth: 1.2,
                },
            ]}
        >
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                if (!options.inNavbar) return;
                const isFocused = state.index === index;

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
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        style={[styles.tab, isFocused && styles.activeTab]}
                    >
                        <View
                            style={
                                isFocused
                                    ? [
                                          styles.activeIconPadding,
                                          {
                                              backgroundColor:
                                                  colors.navbar.active_icon_bg,
                                          },
                                      ]
                                    : [
                                          styles.iconPadding,
                                          {
                                              backgroundColor:
                                                  colors.navbar.icons_bg,
                                          },
                                      ]
                            }
                        >
                            <IconComponent width={36} height={36} />
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
        paddingHorizontal: 12,
        overflow: "visible",
    },
    tab: {
        flex: 1,
        alignItems: "center",
        height: CONFIG.tabBarHeight, // 79
        justifyContent: "center",
    },
    activeTab: {
        zIndex: 2,
    },
    iconPadding: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    activeIconPadding: {
        width: 74,
        height: 74,
        borderRadius: 37,
        alignItems: "center",
        justifyContent: "center",
        transform: [{ translateY: -18 }],
        shadowColor: "#000",
        shadowOpacity: 0.35,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        elevation: 10,
    },
});

export default NavigationBottomBar;

