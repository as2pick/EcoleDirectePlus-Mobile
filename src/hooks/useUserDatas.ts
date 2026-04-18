import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { generateChecksum } from "../utils/crypto";

type Section = {
    data: any | null;
    hash: string | null;
};
type SchoolSection =
    | "timetable"
    | "grades"
    | "homeworks"
    | "messaging"
    | "customHomeworks";

type UserDatasStore = {
    globalUserData: any | null;
    userAccesToken: string | null;
    isConnected: boolean;
    timetable: Section;
    grades: Section;
    homeworks: Section;
    customHomeworks: Section;
    messaging: Section;
    setUserState: (dataOrKey: string | Partial<UserDatasStore>, value?: any) => void;
    updateDataAndChecksum: (section: SchoolSection, newData: any) => Promise<void>;
    getEmptyDatasKeys: () => SchoolSection[];
    getStoredKeys: () => Promise<SchoolSection[]>;
    reset: () => void;
};

const defaultSection = (): Section => ({ data: null, hash: null });

const defaultState = {
    globalUserData: null,
    userAccesToken: null,
    isConnected: false,
    timetable: defaultSection(),
    grades: defaultSection(),
    homeworks: defaultSection(),
    customHomeworks: defaultSection(),
    messaging: defaultSection(),
};

const useUserDatas = create<UserDatasStore>()(
    persist(
        (set) => ({
            ...defaultState,

            setUserState: (dataOrKey, value) =>
                typeof dataOrKey === "string"
                    ? set({ [dataOrKey]: value })
                    : set(dataOrKey),

            updateDataAndChecksum: async (section, newData) => {
                const hash = await generateChecksum(newData);
                set({
                    [section]: {
                        data: newData,
                        hash: hash,
                    },
                });
            },
            getEmptyDatasKeys: () => {
                const state: UserDatasStore = useUserDatas.getState();
                return (
                    [
                        "timetable",
                        "grades",
                        "homeworks",
                        "messaging",
                    ] as SchoolSection[]
                ).filter((key) => state[key]?.data === null);
            },
            getStoredKeys: async () => {
                const state: UserDatasStore = useUserDatas.getState();
                return (
                    [
                        "timetable",
                        "grades",
                        "homeworks",
                        "messaging",
                    ] as SchoolSection[]
                ).filter((key) => state[key]?.data !== null);
            },
            reset: () => {
                useUserDatas.persist.clearStorage();
                set(defaultState);
            },
        }),
        {
            name: "user-data",
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                timetable: state.timetable,
                grades: state.grades,
                homeworks: state.homeworks,
                messaging: state.messaging,
                customHomeworks: state.customHomeworks,
                globalUserDatas: state.globalUserData,
            }),
        }
    )
);
export default useUserDatas;

