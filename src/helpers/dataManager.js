import AsyncStorage from "@react-native-async-storage/async-storage";
import { originName } from "../resolver/resolver";
import apiService from "./apiService";
import { storageServiceStates } from "./storageService";

export default async function dataManager(userToken) {
    // await AsyncStorage.clear();
    // console.log("Storage Empty");
    const rawStorageKeys = await AsyncStorage.getAllKeys();
    const rawStorage = await AsyncStorage.multiGet(rawStorageKeys);

    // await AsyncStorage.clear();
    if (!rawStorage.length) {
        apiService({
            origin: "all",
            userToken: userToken /* origin="all" beacause storage is empty */,
        }); // fetch api;
    }

    if (rawStorageKeys !== originName) {
        const missing = originName.filter((item) => !rawStorageKeys.includes(item));

        missing.map((element) =>
            apiService({ userToken: userToken, origin: element })
        );
    }

    // here all data is in storage

    storageServiceStates.getter({ originKey: "timetable" }).then((c) => {
        console.log(c);
    });

    // rawStorageKeys.forEach((key) => {
    //     storageServiceStates
    //         .getter({ originKey: key })
    //         .finally((c) => console.log(c));
    // });
    // we need timetable, homeworks, grades, messaging

    // compare storage and api
}

