import { createMMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { SubjectColorContext } from "../types";

const storage = createMMKV({ id: "color-store" });

const mmkvStorage = createJSONStorage(() => ({
    getItem: (key) => storage.getString(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.remove(key),
}));

const GOLDEN = 137.508;
const S = 70;
const L = 55;

interface ColorStoreState {
    subjectColors: Record<string, SubjectColorContext>;
    nextIndex: number;
    getColor: (subject: string) => string;
    setSubjectIndex: (subject: string, index: number) => void;
    setSubjectColor: (subject: string, color: string) => void;
    reset: () => void;
}

export const useColorStore = create<ColorStoreState>()(
    persist(
        (set, get) => ({
            subjectColors: {},
            nextIndex: 0,

            getColor: (subject: string): string => {
                const { subjectColors, nextIndex } = get();
                const existing = subjectColors[subject];

                if (existing?.color) {
                    return existing.color;
                }
                if (existing !== undefined) {
                    const h = (existing.index * GOLDEN) % 360;
                    return `hsl(${h}, ${S}%, ${L}%)`;
                }

                const newIndex = nextIndex;
                set({
                    subjectColors: { ...subjectColors, [subject]: { index: newIndex } },
                    nextIndex: newIndex + 1,
                });

                const h = (newIndex * GOLDEN) % 360;
                return `hsl(${h}, ${S}%, ${L}%)`;
            },

            setSubjectIndex: (subject: string, index: number) =>
                set((state) => ({
                    subjectColors: { ...state.subjectColors, [subject]: { index } },
                })),
            setSubjectColor: (subject: string, color: string) =>
                set((state) => ({
                    subjectColors: {
                        ...state.subjectColors,
                        [subject]: { ...state.subjectColors[subject], color },
                    },
                })),

            reset: () => set({ subjectColors: {}, nextIndex: 0 }),
        }),
        {
            name: "color-store",
            storage: mmkvStorage,
            partialize: (state) => ({
                subjectColors: state.subjectColors,
                nextIndex: state.nextIndex,
            }),
        }
    )
);

