import { routesNames } from "../../config/routesNames";
import createScreen from "../../helpers/createScreen";
import Core from "./core/Core";
import Tabs from "./tabs/Tabs";

const {
    navigators: { auth, core, tabs },
} = routesNames;

const appNavigatorOrganisation = [
    createScreen(tabs, Tabs), // PAY ATTENTION TO THE ORDER !
    createScreen(core, Core),
];

export default appNavigatorOrganisation;

