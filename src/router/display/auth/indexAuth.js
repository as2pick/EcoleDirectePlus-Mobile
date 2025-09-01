import LoginScreen from "../../../screens/Auth/Login/LoginScreen.jsx";
import PrivacyPolicyScreen from "../../../screens/Auth/PrivacyPolicyScreen.jsx";
import { routesNames } from "../../config/routesNames.js";
import createScreen from "../../helpers/createScreen.jsx";

const {
    auth: { login, privacyPolicy },
} = routesNames;

const authScreens = [
    createScreen(login, LoginScreen),
    createScreen(privacyPolicy, PrivacyPolicyScreen),
];

export default authScreens;

