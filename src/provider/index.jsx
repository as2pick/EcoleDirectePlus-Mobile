import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppSettingsProvider } from "../context/AppSettingsContext";
import { GlobalAppProvider } from "../context/GlobalAppContext";
import { SignInProvider } from "../context/SignInContext";
import { UserProvider } from "../context/UserContext";

export default function RootProviders({ children }) {
    return (
        <SafeAreaProvider>
            <GlobalAppProvider>
                <AppSettingsProvider>
                    <UserProvider>
                        <SignInProvider>
                            {/* <View style={{ flex: 1 }}> */}
                            {/* {Platform.OS === "android" && (
                                    <StatusBar
                                        backgroundColor="transparent"
                                        translucent={true}
                                    />
                                )} */}
                            {children}
                            {/* </View> */}
                        </SignInProvider>
                    </UserProvider>
                </AppSettingsProvider>
            </GlobalAppProvider>
        </SafeAreaProvider>
    );
}

