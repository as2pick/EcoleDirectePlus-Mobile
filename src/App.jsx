import RootProviders from "./provider";
import AuthNavigator from "./router/AuthNavigator";

export default function App() {
    // useEffect(() => {
    //     authService.deleteStoredApiDatas();
    // }, []);
    return (
        <RootProviders>
            <AuthNavigator />
        </RootProviders>
    );
}

