import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryProvider } from "./QueryProvider";

export default function RootProviders({ children }) {
    return (
        <QueryProvider>
            <SafeAreaProvider>
                {children}
            </SafeAreaProvider>
        </QueryProvider>
    );
}
