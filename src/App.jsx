import { AppSettingsProvider } from "./context/AppSettingsContext";
import { GlobalAppProvider } from "./context/GlobalAppContext";
import { SignInProvider } from "./context/SignInContext";
import { UserProvider } from "./context/UserContext";
import LoginScreen from "./screens/Login/LoginScreen";
export default function App() {
    return (
        <UserProvider>
            <AppSettingsProvider>
                <SignInProvider>
                    <GlobalAppProvider>
                        <LoginScreen />
                    </GlobalAppProvider>
                </SignInProvider>
            </AppSettingsProvider>
        </UserProvider>
    );
}

