import { createMMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { UserProfile } from "../types";

const storage = createMMKV({ id: "user-store" });


const mmkvStorage = createJSONStorage(() => ({
    getItem: (key) => storage.getString(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.remove(key),
}));

interface UserStoreState {
    profile: UserProfile | null;
    token: string | null;

    setProfile: (profile: UserProfile | null) => void;
    setToken: (token: string | null) => void;
    reset: () => void;
}

export const useUserStore = create<UserStoreState>()(
    persist(
        (set) => ({
            profile: null,
            token: null,

            setProfile: (profile) => set({ profile }),
            setToken: (token) => set({ token }),
            reset: () => set({ profile: null, token: null }),
        }),
        {
            name: "user-store",
            storage: mmkvStorage,
            partialize: (state) => ({
                profile: state.profile,
            }),
        }
    )
);

