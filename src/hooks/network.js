import { useGlobalApp } from "../context/GlobalAppContext";

export const useNetwork = () => {
    const { activeNetworkStatus } = useGlobalApp();

    return {
        isConnected: activeNetworkStatus.isConnected ?? false,
        isInternetReachable: activeNetworkStatus.isInternetReachable ?? false,
        type: activeNetworkStatus.type ?? "unknown",
        inAirplaneMode: activeNetworkStatus.inAirplaneMode ?? false,
        isOnline:
            (activeNetworkStatus.isConnected &&
                activeNetworkStatus.isInternetReachable) ??
            false,
    };
};

