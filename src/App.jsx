import RootProviders from "./providers";
import AuthNavigator from "./router/AuthNavigator";

export default function App() {
    return (
        <RootProviders>
            <AuthNavigator />
        </RootProviders>
    );
}

