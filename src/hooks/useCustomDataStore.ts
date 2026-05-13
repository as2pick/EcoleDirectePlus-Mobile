import { createMMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Homework } from "../types";

const storage = createMMKV({ id: "custom-data-storage" });

const mmkvStorage = createJSONStorage(() => ({
    getItem: (key) => storage.getString(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.remove(key),
}));

export interface SimulatedGrade {
    id: string;
    disciplineCode: string;
    periodCode: string;
    libelle: string;
    grade: number;
    outOf: number;
    coef: number;
    isSimulation: true;
}

interface CustomDataState {
    customHomeworks: Homework[];
    simulatedGrades: SimulatedGrade[];

    addCustomHomework: (homework: Homework) => void;
    toggleCustomHomeworkDone: (id: number) => void;
    removeCustomHomework: (id: number) => void;

    addSimulatedGrade: (grade: SimulatedGrade) => void;
    removeSimulatedGrade: (id: string) => void;
    clearSimulatedGrades: (disciplineCode?: string) => void;
}

export const useCustomDataStore = create<CustomDataState>()(
    persist(
        (set, get) => ({
            customHomeworks: [],
            simulatedGrades: [],

            addCustomHomework: (homework) =>
                set((state) => ({
                    customHomeworks: [...state.customHomeworks, homework],
                })),

            toggleCustomHomeworkDone: (id) =>
                set((state) => ({
                    customHomeworks: state.customHomeworks.map((hw) =>
                        hw.id === id ? { ...hw, isDone: !hw.isDone } : hw
                    ),
                })),

            removeCustomHomework: (id) =>
                set((state) => ({
                    customHomeworks: state.customHomeworks.filter((hw) => hw.id !== id),
                })),

            addSimulatedGrade: (grade) =>
                set((state) => ({
                    simulatedGrades: [...state.simulatedGrades, grade],
                })),

            removeSimulatedGrade: (id) =>
                set((state) => ({
                    simulatedGrades: state.simulatedGrades.filter((g) => g.id !== id),
                })),

            clearSimulatedGrades: (disciplineCode) =>
                set((state) => ({
                    simulatedGrades: disciplineCode
                        ? state.simulatedGrades.filter(
                            (g) => g.disciplineCode !== disciplineCode
                        )
                        : [],
                })),
        }),
        {
            name: "custom-data-storage",
            storage: mmkvStorage,
        }
    )
);

