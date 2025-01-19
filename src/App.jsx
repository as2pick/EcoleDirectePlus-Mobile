import { AppSettingsProvider } from "./context/AppSettingsContext";
import { GlobalAppProvider } from "./context/GlobalAppContext";
import { LoginProvider } from "./context/LoginContext";
import { UserProvider } from "./context/UserContext";
import LoginScreen from "./screens/Login/LoginScreen";
export default function App() {
    return (
        <UserProvider>
            <AppSettingsProvider>
                <LoginProvider>
                    <GlobalAppProvider>
                        <LoginScreen />
                    </GlobalAppProvider>
                </LoginProvider>
            </AppSettingsProvider>
        </UserProvider>
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

