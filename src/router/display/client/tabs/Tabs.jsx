import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { NavigationBottomBar } from "../../../../components";
import { routesNames } from "../../../config/routesNames";
import mapScreens from "../../../helpers/mapScreens";
import tabClientScreens from "./indexClientTabs";

const Tab = createBottomTabNavigator();

export default function Tabs() {
    const screens = mapScreens({ navMethod: Tab, screenArray: tabClientScreens });

    return (
        <Tab.Navigator
            tabBar={(props) => <NavigationBottomBar {...props} />}
            initialRouteName={routesNames.client.home}
            screenOptions={{ headerShown: false, animation: "fade" }}
        >
            {screens}
        </Tab.Navigator>
    );
}

