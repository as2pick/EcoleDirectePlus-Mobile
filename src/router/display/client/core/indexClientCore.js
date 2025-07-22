import SettingsScreen from "../../../../screens/Client/Settings/SettingsScreen";
import { routesNames } from "../../../config/routesNames";
import createScreen from "../../../helpers/createScreen";

const {
    core: { settings },
} = routesNames;

const coreClientScreen = [createScreen(settings, SettingsScreen)];

export default coreClientScreen;

