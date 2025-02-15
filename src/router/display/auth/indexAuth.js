import LoginScreen from "../../../screens/Auth/Login/LoginScreen.jsx";
import createScreen from "../../helpers/createScreen.jsx";

const authScreens = [createScreen("Login", LoginScreen, { headerShown: false })];

export default authScreens;

