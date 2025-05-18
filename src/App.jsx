import { useEffect } from "react";
import RootProviders from "./provider";
import AuthNavigator from "./router/AuthNavigator";
import authService from "./services/login/authService";

export default function App() {
    useEffect(() => {
        authService.deleteStoredApiDatas(); // TEEMPPP !!!!
    }, []);
    return (
        <RootProviders>
            <AuthNavigator />
        </RootProviders>
    );
}

