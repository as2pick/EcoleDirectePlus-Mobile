import AsyncStorage from "@react-native-async-storage/async-storage";
import { isJsonObject, isParsableJson } from "../utils/json";

class StorageManager {
    constructor() {
        this.saveTimeout = null;
        this.pendingData = null;
    }
    scheduleUpdateData(key, data) {
        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
        }

        this.pendingData = data;

        this.saveTimeout = setTimeout(() => {
            setImmediate(async () => {
                try {
                    await AsyncStorage.setItem(
                        key,
                        JSON.stringify(this.pendingData)
                    );

                    /// REGENERATE CHECKSUM !
                } catch (e) {
                    console.log(`Error on schedule data for ${key}`);
                }
                this.pendingData = null;
            });
        }, 500);
    }
    async setter({ originKey, dataToStore }) {
        if (isJsonObject(dataToStore)) {
            dataToStore = JSON.stringify(dataToStore);
        }
        await AsyncStorage.setItem(originKey, dataToStore);
    }

    async getter({ originKey }) {
        const data = await AsyncStorage.getItem(originKey);
        if (data !== null) {
            if (isParsableJson(data)) {
                return JSON.parse(data);
            } else {
                return data;
            }
        }
        return null;
    }
}

export const storageManager = new StorageManager();

