import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppSettingsProvider } from "../context/AppSettingsContext";
import { GlobalAppProvider } from "../context/GlobalAppContext";
import { SignInProvider } from "../context/SignInContext";
import { ThemeProvider } from "../context/ThemeContext";
import { UserProvider } from "../context/UserContext";
import { QueryProvider } from "./QueryProvider";

export default function RootProviders({ children }) {
    return (
        <QueryProvider>
            <SafeAreaProvider>
                <ThemeProvider>
                    <GlobalAppProvider>
                        <AppSettingsProvider>
                            <UserProvider>
                                <SignInProvider>
                                    {children}
                                </SignInProvider>
                            </UserProvider>
                        </AppSettingsProvider>
                    </GlobalAppProvider>
                </ThemeProvider>
            </SafeAreaProvider>
        </QueryProvider>
    );
}
