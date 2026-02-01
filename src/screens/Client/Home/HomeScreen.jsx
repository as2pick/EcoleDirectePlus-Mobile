import { Button } from "@react-navigation/elements";
import { useNavigation, useFocusEffect, useTheme } from "@react-navigation/native";
import { useCallback } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

import { useActionBar } from "../../../context/ActionBarContext";
import DashboardIcon from "../../../../assets/svg/navigation/DashboardIcon";
import { SafeAreaView } from "react-native-safe-area-context";
import InDev from "../../../components/Ui/InDev";
import { useUser } from "../../../context/UserContext";
import { routesNames } from "../../../router/config/routesNames";
import authService from "../../../services/login/authService";
import Text from "../../../components/Ui/core/Text.jsx";

export default function HomeScreen() {
    const { setIsConnected } = useUser();
    const navigation = useNavigation();
    const { updateActions } = useActionBar();
    const theme = useTheme();

    const styles = createStyles(theme);

    const progress = useSharedValue(0);

    const animatedWidthAccount = useAnimatedStyle(() => {
        return {
            width: interpolate(progress.value, [0, 1], [0, 220]),
            paddingLeft: interpolate(progress.value, [0, 1], [0, 70]),
        };
    });
    const animatedWidthName = useAnimatedStyle(() => {
        return {
            width: interpolate(progress.value, [0, 1], [0, 150]),
            left: interpolate(progress.value, [0, 1], [55, 120]),
        };
    });

    useFocusEffect(
        useCallback(() => {
            updateActions([
                {
                    icon: DashboardIcon,
                    onPress: () => navigation.navigate(routesNames.navigators.core),
                },
            ]);
        }, [updateActions, navigation])
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.lottieContainer}>
                <LottieView
                    source={require("../../../../assets/json/lottie/Home2.json")}
                    autoPlay
                    loop
                    style={styles.lottie}
                />
            </View>
            <TouchableOpacity
                activeOpacity={1}
                style={styles.accountContainer}
                onPress={() => {
                    progress.value = withTiming(progress.value === 0 ? 1 : 0, {
                        duration: 300,
                    });
                }}
            ></TouchableOpacity>
            <Animated.View
                style={[styles.accountInformationsContainer, animatedWidthAccount]}
            >
                <Text>Name Surname</Text>
                <View style={styles.accountButtonsContainer}>
                    <TouchableOpacity>
                        <Text>Disconnect</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text>Sombre</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
            {/*<Button
                onPress={async () => {
                    await authService.deleteCredentials();
                    await setIsConnected(false);
                }}
            >
                Disconect and forget secrets
            </Button>
            <Button onPress={() => navigation.navigate(routesNames.navigators.core)}>
                Navigate to settings
            </Button>*/}
            <InDev />
        </SafeAreaView>
    );
}

const createStyles = (theme) =>
    StyleSheet.create({
        container: {
            top: 0,
            width: "100%",
            backgroundColor: theme.colors.background,
        },
        lottieContainer: {
            alignItems: "center",
            justifyContent: "center",
            top: -25,
            height: 270
        },
        lottie: {
            top: 0,
            width: "100%",
            height: "100%",
        },
        accountContainer: {
            top: 45,
            left: 30,
            position: "absolute",
            height: 80,
            width: 80,
            backgroundColor: "yellow",
            borderRadius: 50,
            zIndex: 2001,
        },
        accountInformationsContainer: {
            top: 50,
            left: 50,
            position: "absolute",
            height: 65,
            backgroundColor: "white",
            borderRadius: 50,
            zIndex: 2000,
            padding: 8,
            justifyContent: "center",
            gap: 7,
        },
        accountButtonsContainer: {
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            right: 8,
            gap: 8,
        }
    });

