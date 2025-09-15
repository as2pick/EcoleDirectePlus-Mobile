import AsyncStorage from "@react-native-async-storage/async-storage";
import { originName } from "../resolver/resolver";
import { arraysEqual } from "../utils/json";
import apiService, { dataUpdater } from "./apiService";

export default async function dataManager(
    userToken,
    network = {
        inAirplaneMode: null,
        isConnected: null,
        isInternetReachable: null,
        isOnline: null,
        type: "unknown",
    }
) {
    let rawStorageKeys = await AsyncStorage.getAllKeys();
    if (rawStorageKeys.includes("userData")) {
        rawStorageKeys = rawStorageKeys.filter(
            (userData) => userData !== "userData"
        ); // remove user data from origins in storage
    }

    const keysStored = rawStorageKeys.filter((key) => originName.includes(key));
    console.log(keysStored);
    if (arraysEqual(keysStored, originName)) {
        if (network.isOnline) {
            console.log(
                "Toutes les données sont en stockage et le réseau est en ligne."
            );
            dataUpdater(userToken);
            // update datas if necessary
            return;
        } else {
            console.log(
                "Toutes les données sont en stockage, mais le réseau est hors ligne."
            );
            // warning
            return;
        }
    } else {
        if (network.isOnline) {
            const missing = originName.filter(
                (item) => !rawStorageKeys.includes(item)
            );
            console.log("Données manquantes et le réseau est en ligne.");
            // fetch api obligation
            if (originName.length - missing.length === 0) {
                // completely empty
                await apiService({
                    origin: "all",
                    userToken: userToken /* origin="all" because storage is empty */,
                });

                return;
            } else {
                // partially empty
                await Promise.all(
                    missing.map((element) =>
                        apiService({ userToken: userToken, origin: element })
                    )
                );
                return;
            }
        } else {
            console.log("Données manquantes et le réseau est hors ligne.");
            // prblm use default datas (generic JSON) and warn
        }
    }
}

