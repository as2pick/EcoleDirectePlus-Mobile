import AsyncStorage from "@react-native-async-storage/async-storage";
import { originName } from "../resolver/resolver";
import { arraysEqual } from "../utils/json";
import apiService from "./apiService";

export default async function dataManager(userToken) {
    let rawStorageKeys = await AsyncStorage.getAllKeys();
    if (rawStorageKeys.includes("userData")) {
        rawStorageKeys = rawStorageKeys.filter(
            (userData) => userData !== "userData"
        ); // remove user data from origins in storage
    }
    const rawStorage = await AsyncStorage.multiGet(rawStorageKeys);

    // await AsyncStorage.clear();
    if (!rawStorage.length) {
        console.log("Fetch All Origins");
        apiService({
            origin: "all",
            userToken: userToken /* origin="all" beacause storage is empty */,
        }); // fetch api;
    }

    if (arraysEqual(rawStorageKeys, originName)) {
        const missing = originName.filter((item) => !rawStorageKeys.includes(item));
        console.log(`Fetch ${missing} datas`);

        missing.map((element) =>
            apiService({ userToken: userToken, origin: element })
        );
    }

    // here all data is in storage

    // compare storage and api
}

