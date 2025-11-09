// components/CustomNavbar.js
import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { CONFIG } from "../../constants/config";

const NavigationBottomBar = ({ state, descriptors, navigation }) => {
    const [isPressedIn, setIsPressedIn] = useState(false);
    const [isLongPressed, setIsLongPressed] = useState(false);

    const { colors } = useTheme();

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    //borderTopColor: colors.navbar.border,
                    //borderWidth: 1.2,
                    borderRadius: 30,
                    boxShadow: "0px 8px 9px -5px rgba(0, 0, 0, 0.25)",
                    boxShadow: "0px 15px 22px 2px rgba(0, 0, 0, 0.14)",
                    //shadowColor: "black",
                    //shadowOffset: { width: 0, height: -2 },
                    //shadowOpacity: 0.3,
                    //shadowRadius: 15,
                    bottom: 10,
                    marginHorizontal: 10,
                    position: "absolute",
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
                        onPressIn={() => setIsPressedIn(true)}
                        onPressOut={() => {
                            setIsPressedIn(false);
                            setIsLongPressed(false);
                        }}
                        onLongPress={() => setIsLongPressed(true)}
                        style={styles.tab}
                    >
                        <View
                            style={
                                isFocused
                                    ? [
                                          styles.iconPadding,
                                          {
                                              backgroundColor:
                                                  colors.main,
                                                  //colors.navbar.active_icon_bg,
                                          },
                                      ]
                                    : [
                                          styles.iconPadding,
                                          {
                                              backgroundColor:
                                                  colors.secondary,
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
    },
    tab: {
        flex: 1,
        alignItems: "center",
        height: CONFIG.tabBarHeight, // 79
        justifyContent: "center",
    },
    iconPadding: { padding: 7, borderRadius: 15, },
});

export default NavigationBottomBar;

