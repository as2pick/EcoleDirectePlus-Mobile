import AsyncStorage from "@react-native-async-storage/async-storage";
import { originName } from "../resolver/resolver";
import { arraysEqual } from "../utils/json";
import apiService from "./apiService";

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

    if (arraysEqual(keysStored, originName)) {
        if (network.isOnline) {
            console.log(
                "Toutes les données sont en stockage et le réseau est en ligne."
            );
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

    // if (!isStorageEmpty && network.isOnline) {
    //     console.log(
    //         "All datas are in your storage, we start API update to compare changes"
    //     );
    // } else if (isStorageEmpty && network.isOnline) {
    //     await apiService({
    //         origin: "all",
    //         userToken: userToken /* origin="all" because storage is empty */,
    //     });

    //     return;
    // } else if (!isStorageEmpty && !network.isOnline) {
    //     // throw custom error (warning) view custom throw errors
    //     console.log(
    //         "Warning ! You are not connected to internet but you have all datas stored on your device, unable to update API data"
    //     );
    // } else if (isStorageEmpty && !network.isOnline) {
    //     throw new Error(
    //         "Storage is empty and you are not connected to Internet, unable to fetch API"
    //     );
    // }

    // if (
    //     !arraysEqual(
    //         rawStorageKeys.filter((key) => originName.includes(key)),
    //         originName
    //     ) &&
    //     network.isOnline
    // ) {
    //     const missing = originName.filter((item) => !rawStorageKeys.includes(item));
    //     console.log(`Fetch ${missing} datas`);
    //     await Promise.all(
    //         missing.map((element) =>
    //             apiService({ userToken: userToken, origin: element })
    //         )
    //     );
    // } else if (
    //     !arraysEqual(
    //         rawStorageKeys.filter((key) => originName.includes(key)),
    //         originName
    //     ) &&
    //     !network.isOnline
    // ) {
    //     // throw custom error (warning) view custom throw errors
    //     console.log(
    //         `[@#@#@] WARNING - STORAGE IS INCOMPLETED ${originName.filter((item) => !rawStorageKeys.includes(item))} MISSING, YOU ARE NOT CONNECTED TO INTERNET: UNABLE TO FETCH API`
    //     );
    // }

    // here all data is in storage

    // compare storage and api
}

