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
    console.log("Data keys stored on device : ", keysStored);
    if (arraysEqual(keysStored, originName)) {
        if (network.isOnline) {
            console.log("All datas are stored on devices and network is connected");
            dataUpdater(userToken);

            // update datas if necessary
            return;
        } else {
            console.log("All datas are stored on devices but network is offline");
            // warning
            return;
        }
    } else {
        if (network.isOnline) {
            const missing = originName.filter(
                (item) => !rawStorageKeys.includes(item)
            );
            console.log(
                "Invalid data count stored, network connected ,process to update them"
            );
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
            console.log("Invalid data and network is offline");
            // prblm use default datas (generic JSON) and warn
        }
    }
}

