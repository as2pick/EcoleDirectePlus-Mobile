// TODO: remplacer AsyncStorage par MMKV quand on aura un Dev Build
// import { MMKV } from "react-native-mmkv";
// const userStorage = new MMKV({ id: "user-store" });
// const mmkvStorage = createJSONStorage(() => ({
//     getItem: (key) => userStorage.getString(key) ?? null,
//     setItem: (key, value) => userStorage.set(key, value),
//     removeItem: (key) => userStorage.delete(key),
// }));

import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { UserProfile } from "../types";

const mmkvStorage = createJSONStorage(() => AsyncStorage);

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
