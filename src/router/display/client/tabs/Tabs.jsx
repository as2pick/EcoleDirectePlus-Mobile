import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";

import { NavigationBottomBar, ActionBar } from "../../../../components";
import { routesNames } from "../../../config/routesNames";
import mapScreens from "../../../helpers/mapScreens";
import tabClientScreens from "./indexClientTabs";

const Tab = createBottomTabNavigator();
const Action = createBottomTabNavigator();

export default function Tabs() {
    const screens = mapScreens({ navMethod: Tab, screenArray: tabClientScreens, actionMethod: Action });

    return (
        <View style={{ flex: 1 }}>
            <Tab.Navigator
                tabBar={(props) => <NavigationBottomBar {...props} />}
                initialRouteName={routesNames.client.home}
                screenOptions={{ headerShown: false, animation: "fade" }}
            >
                {screens}
            </Tab.Navigator>
            <ActionBar />
        </View>
    );
}

