import { AppSettingsProvider } from "./context/AppSettingsContext";
import { ErrorProvider } from "./context/ErrorContext";
import { GlobalAppProvider } from "./context/GlobalAppContext";
import { SignInProvider } from "./context/SignInContext";
import { UserProvider } from "./context/UserContext";
import LoginScreen from "./screens/Login/LoginScreen";
export default function App() {
    return (
        <ErrorProvider>
            <UserProvider>
                <AppSettingsProvider>
                    <SignInProvider>
                        <GlobalAppProvider>
                            <LoginScreen />
                        </GlobalAppProvider>
                    </SignInProvider>
                </AppSettingsProvider>
            </UserProvider>
        </ErrorProvider>
    );
}
// <UserProvider>
//     <AppSettingsProvider>
//         <LoginProvider>
//             <GlobalAppProvider>
//                 <LoginScreen />
//             </GlobalAppProvider>
//         </LoginProvider>
//     </AppSettingsProvider>
// </UserProvider>

