import { SafeAreaProvider } from "react-native-safe-area-context";
import { GlobalAppProvider } from "../context/GlobalAppContext";
import { SignInProvider } from "../context/SignInContext";
import { QueryProvider } from "./QueryProvider";

export default function RootProviders({ children }) {
    return (
        <QueryProvider>
            <SafeAreaProvider>
                <GlobalAppProvider>
                    <SignInProvider>
                        {children}
                    </SignInProvider>
                </GlobalAppProvider>
            </SafeAreaProvider>
        </QueryProvider>
    );
}
