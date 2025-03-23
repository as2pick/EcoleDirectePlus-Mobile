import RootProviders from "./provider";
import AuthNavigator from "./router/AuthNavigator";

export default function App() {
    return (
        <RootProviders>
            <AuthNavigator />
        </RootProviders>
    );
}

