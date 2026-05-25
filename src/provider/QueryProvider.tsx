import { createMMKV } from "react-native-mmkv";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 min
            gcTime: 1000 * 60 * 60 * 14, // 14 h
            refetchOnWindowFocus: false,
            retry: 2,
        },
    },
});

const mmkv = createMMKV({ id: "query-cache" });

const mmkvPersister = createSyncStoragePersister({
    storage: {
        getItem: (key) => mmkv.getString(key) ?? null,
        setItem: (key, value) => mmkv.set(key, value),
        removeItem: (key) => mmkv.remove(key),
    },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister: mmkvPersister }}
        >
            {children}
        </PersistQueryClientProvider>
    );
}
