import { AppSettingsProvider } from "./context/AppSettingsContext";
import { GlobalAppProvider } from "./context/GlobalAppContext";
import { SignInProvider } from "./context/SignInContext";
import { UserProvider } from "./context/UserContext";
import AuthNavigator from "./routes/AuthNavigator";
export default function App() {
    return (
        <GlobalAppProvider>
            <AppSettingsProvider>
                <UserProvider>
                    <SignInProvider>
                        <AuthNavigator />
                    </SignInProvider>
                </UserProvider>
            </AppSettingsProvider>
        </GlobalAppProvider>
    );
}

