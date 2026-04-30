// TODO: Migrer vers MMKV + createSyncStoragePersister quand on aura un Dev Build.
// Avec MMKV, le cache sera lu de façon SYNCHRONE au démarrage → zéro délai d'affichage.
// import { MMKV } from "react-native-mmkv";
// import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
// const mmkv = new MMKV({ id: "query-cache" });
// const mmkvPersister = createSyncStoragePersister({
//     storage: {
//         getItem: (key) => mmkv.getString(key) ?? null,
//         setItem: (key, value) => mmkv.set(key, value),
//         removeItem: (key) => mmkv.delete(key),
//     },
// });

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 60 * 14,
            refetchOnWindowFocus: false,
            retry: 2,
        },
    },
});

const asyncStoragePersister = createAsyncStoragePersister({
    storage: AsyncStorage,
    key: "edp-query-cache",
    throttleTime: 1000,
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister: asyncStoragePersister }}
        >
            {children}
        </PersistQueryClientProvider>
    );
}
