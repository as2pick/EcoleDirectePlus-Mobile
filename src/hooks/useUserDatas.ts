import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                globalUserData: state.globalUserData,
                subjectColors: state.subjectColors,
            }),
        }
    )
);
export default useUserDatas;
