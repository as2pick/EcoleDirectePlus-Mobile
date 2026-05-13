import { createMMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const storage = createMMKV({ id: "user-data" });

const mmkvStorage = createJSONStorage(() => ({
    getItem: (key) => storage.getString(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.remove(key),
}));

type UserDatasStore = {
    globalUserData: any | null;
    userAccesToken: string | null;
    isConnected: boolean;
    subjectColors: Record<string, string>;

    setUserState: (dataOrKey: string | Partial<UserDatasStore>, value?: any) => void;
    reset: () => void;
};

const defaultState = {
    globalUserData: null,
    userAccesToken: null,
    isConnected: false,
    subjectColors: {},
};

const useUserDatas = create<UserDatasStore>()(
    persist(
        (set) => ({
            ...defaultState,

            setUserState: (dataOrKey, value) =>
                typeof dataOrKey === "string"
                    ? set({ [dataOrKey]: value })
                    : set(dataOrKey),

            reset: () => {
                useUserDatas.persist.clearStorage();
                set(defaultState);
            },
        }),
        {
            name: "user-data",
            storage: mmkvStorage,
            partialize: (state) => ({
                globalUserData: state.globalUserData,
                subjectColors: state.subjectColors,
            }),
        }
    )
);

export default useUserDatas;

