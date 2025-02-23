import LoginScreen from "../../../screens/Auth/Login/LoginScreen.jsx";
import PrivacyPolicyScreen from "../../../screens/Auth/PrivacyPolicyScreen.jsx";
import createScreen from "../../helpers/createScreen.jsx";

const authScreens = [
    createScreen("Login", LoginScreen),
    createScreen("PrivacyPolicy", PrivacyPolicyScreen),
];

export default authScreens;

