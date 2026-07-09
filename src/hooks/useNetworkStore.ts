import { create } from "zustand";

interface NetworkState {
    isConnected: boolean | null;
    isInternetReachable: boolean | null;
    type: string;
    inAirplaneMode: boolean | null;
}

interface NetworkStore {
    activeNetworkStatus: NetworkState;
    setActiveNetworkStatus: (
        status: Partial<NetworkState> | ((prev: NetworkState) => Partial<NetworkState>)
    ) => void;
}

export const useNetworkStore = create<NetworkStore>((set) => ({
    activeNetworkStatus: {
        isConnected: null,
        isInternetReachable: null,
        type: "unknown",
        inAirplaneMode: null,
    },
    setActiveNetworkStatus: (status) =>
        set((state) => ({
            activeNetworkStatus: {
                ...state.activeNetworkStatus,
                ...(typeof status === "function" ? status(state.activeNetworkStatus) : status),
            },
        })),
}));
