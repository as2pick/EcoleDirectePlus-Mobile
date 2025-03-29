import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import NavigationBottomBar from "../components/Navigation/NavigationBottomBar";
import { routesNames } from "./config/routesNames";
import clientScreens from "./display/client/indexClient";
import mapScreens from "./helpers/mapScreens";

const Tab = createBottomTabNavigator();

export default function RootTabs() {
    const screens = mapScreens({ navMethod: Tab, screenArray: clientScreens });

    return (
        <SafeAreaProvider>
            <Tab.Navigator
                tabBar={(props) => <NavigationBottomBar {...props} />}
                initialRouteName={routesNames.client.home}
            >
                {screens}
            </Tab.Navigator>
        </SafeAreaProvider>
    );
}

