import AsyncStorage from "@react-native-async-storage/async-storage";
import { originName } from "../resolver/resolver";
import apiService from "./apiService";

export default async function dataManager(userToken) {
    await AsyncStorage.clear();
    const rawStorageKeys = await AsyncStorage.getAllKeys();
    const rawStorage = await AsyncStorage.multiGet(rawStorageKeys);

    // await AsyncStorage.clear();
    if (!rawStorage.length) {
        apiService({
            userToken: userToken /* origin="default" beacause storage is empty */,
        }); // fetch api;
    }

    if (rawStorageKeys !== originName) {
        const missing = originName.filter((item) => !rawStorageKeys.includes(item));

        missing.map((element) =>
            apiService({ userToken: userToken, origin: element })
        );
    }
    // we need timetable, homeworks, grades, messaging

    // compare storage and api
}

