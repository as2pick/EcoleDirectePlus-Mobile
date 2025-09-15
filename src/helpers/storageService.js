import AsyncStorage from "@react-native-async-storage/async-storage";
import { isJsonObject, isParsableJson } from "../utils/json";

export const storageServiceStates = {
    setter: async ({ originKey, dataToStore }) => {
        if (isJsonObject(dataToStore)) {
            dataToStore = JSON.stringify(dataToStore);
        }
        await AsyncStorage.setItem(originKey, dataToStore);
    },

    getter: async ({ originKey }) => {
        const data = await AsyncStorage.getItem(originKey);
        if (data !== null) {
            if (isParsableJson(data)) {
                return JSON.parse(data);
            } else {
                return data;
            }
        }
        return null;
    },
};

