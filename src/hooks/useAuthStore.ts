import { create } from "zustand";

interface AuthState {
    status: 'idle' | 'loading' | 'success' | 'error' | 'a2f' | 'booting';
    error: string | null;

    mcqDatas: { question: string; choices: string[] } | null;
    selectedChoice: string | null;
    a2fInfos: { identifiant: string | null; motdepasse: string | null; fa: any[] | null } | null;
    a2fToken: string | null;
    gtk: string | null;
    keepConnected: boolean;

    setStatus: (status: AuthState['status']) => void;
    setError: (error: string | null) => void;
    setMcqDatas: (datas: AuthState['mcqDatas']) => void;
    setSelectedChoice: (choice: string) => void;


    setA2fInfos: (infos: Partial<AuthState['a2fInfos']>) => void;
    setA2fToken: (token: string | null) => void;
    setGtk: (gtk: string | null) => void;
    setKeepConnected: (keep: boolean) => void;

    reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    status: 'booting',
    error: null,
    mcqDatas: null,
    selectedChoice: null,
    a2fInfos: null,
    a2fToken: null,
    gtk: null,
    keepConnected: true,

    setStatus: (status) => set({ status }),
    setError: (error) => set({ error, status: error ? 'error' : 'idle' }),
    setMcqDatas: (mcqDatas) => set({ mcqDatas, status: 'a2f' }),
    setSelectedChoice: (selectedChoice) => set({ selectedChoice }),
    setA2fInfos: (infos) => set((state) => ({
        a2fInfos: state.a2fInfos ? { ...state.a2fInfos, ...infos } : { identifiant: null, motdepasse: null, fa: null, ...infos }
    })),
    setA2fToken: (a2fToken) => set({ a2fToken }),
    setGtk: (gtk) => set({ gtk }),
    setKeepConnected: (keepConnected) => set({ keepConnected }),

    reset: () => set({
        status: 'idle',
        error: null,
        mcqDatas: null,
        selectedChoice: null,
        a2fInfos: null,
        a2fToken: null,
        gtk: null
    }),
}));

