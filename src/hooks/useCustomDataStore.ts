import { createMMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Homework } from "@/features/homeworks";
import type { SimulatedGrade } from "@/features/grades";

const storage = createMMKV({ id: "custom-data-store" });

const mmkvStorage = createJSONStorage(() => ({
    getItem: (key) => storage.getString(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.remove(key),
}));

interface CustomDataState {
    customHomeworks: Homework[];
    simulatedGrades: SimulatedGrade[];

    addCustomHomework: (homework: Homework) => void;
    toggleCustomHomeworkDone: (id: number) => void;
    removeCustomHomework: (id: number) => void;

    addSimulatedGrade: (grade: SimulatedGrade) => void;
    removeSimulatedGrade: (id: string) => void;
    clearSimulatedGrades: (disciplineCode?: string) => void;
    reset: () => void;
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
                        hw.id === id
                            ? {
                                  ...hw,
                                  isDone: hw.isDone === "done" ? "todo" : "done",
                              }
                            : hw
                    ),
                })),

            removeCustomHomework: (id) =>
                set((state) => ({
                    customHomeworks: state.customHomeworks.filter(
                        (hw) => hw.id !== id
                    ),
                })),

            addSimulatedGrade: (grade) =>
                set((state) => ({
                    simulatedGrades: [...state.simulatedGrades, grade],
                })),

            removeSimulatedGrade: (id) =>
                set((state) => ({
                    simulatedGrades: state.simulatedGrades.filter(
                        (g) => g.id !== id
                    ),
                })),

            clearSimulatedGrades: (disciplineCode) =>
                set((state) => ({
                    simulatedGrades: disciplineCode
                        ? state.simulatedGrades.filter(
                              (g) => g.disciplineCode !== disciplineCode
                          )
                        : [],
                })),

            reset: () =>
                set({
                    customHomeworks: [],
                    simulatedGrades: [],
                }),
        }),
        {
            name: "custom-data-store",
            storage: mmkvStorage,
        }
    )
);

