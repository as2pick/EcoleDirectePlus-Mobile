import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { THEMES_ASSOCIATIONS } from "../themes/themes";
import type { AppTheme, AppThemeConfig } from "../types";

interface ThemeState {
    themeMode: AppTheme;
    followSystem: boolean;
    systemTheme: AppTheme;

    setThemeMode: (mode: AppTheme) => void;
    setFollowSystem: (follow: boolean) => void;
    setSystemTheme: (theme: AppTheme) => void;
    getTheme: () => AppThemeConfig;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            themeMode: 'light',
            followSystem: true,
            systemTheme: 'light',

            setThemeMode: (themeMode) => set({ themeMode, followSystem: false }),
            setFollowSystem: (followSystem) => set({ followSystem }),

            setSystemTheme: (systemTheme) => set({ systemTheme }),

            getTheme: () => {
                const { followSystem, systemTheme, themeMode } = get();
                const activeMode = followSystem ? systemTheme : themeMode;
                return THEMES_ASSOCIATIONS[activeMode];
            },
        }),
        {
            name: "theme-storage",
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                themeMode: state.themeMode,
                followSystem: state.followSystem,
            }),
        }
    )
);

export const useTheme = () => {
    return useThemeStore((state) => {
        const activeMode = state.followSystem ? state.systemTheme : state.themeMode;
        return THEMES_ASSOCIATIONS[activeMode];
    });
};

/**
 * Helper hook to get the active theme mode string ('light' or 'dark')
 */
export const useActiveThemeMode = () => {
    return useThemeStore((state) => state.followSystem ? state.systemTheme : state.themeMode);
};
