export interface SubjectColorContext {
    color?: string;
    index: number;
}

export interface UserProfile {
    id: number;
    name: string;
    surname: string;
    sex: string;
    phone: string;
    email: string;
    schoolName: string;
    class: {
        libelle: string;
        code: string;
    };
}

export type AppTheme = "light" | "dark";

export interface UserPreferences {
    theme: AppTheme;
    isFollowingSystem: boolean;
}

export interface NetworkInfo {
    isConnected: boolean;
    isInternetReachable: boolean;
    type: string;
    inAirplaneMode: boolean;
    isOnline: boolean;
}
