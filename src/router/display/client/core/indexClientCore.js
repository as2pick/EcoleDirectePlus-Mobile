import SettingsScreen from "@/screens/Client/Settings/SettingsScreen";
import { routesNames } from "../../../config/routesNames";
import createScreen from "@/router/helpers/createScreen";

const {
    core: { settings },
} = routesNames;

const coreClientScreen = [createScreen(settings, SettingsScreen)];

export default coreClientScreen;

