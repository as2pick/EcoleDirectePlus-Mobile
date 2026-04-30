import { StatusBar } from "expo-status-bar";
import RootProviders from "./provider";
import AuthNavigator from "./router/AuthNavigator";

export default function App() {
    return (
        <RootProviders>
            <StatusBar hidden />
            <AuthNavigator />
        </RootProviders>
    );
}

