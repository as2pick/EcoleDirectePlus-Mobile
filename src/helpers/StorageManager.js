import AsyncStorage from "@react-native-async-storage/async-storage";
import useUserDatas from "../hooks/useUserDatas";
import { isParsableJson } from "../utils/json";

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
                    useUserDatas
                        .getState()
                        .updateDataAndChecksum(key, this.pendingData);
                } catch (e) {
                    console.log(`Error on schedule data for ${key}`, e);
                }
                this.pendingData = null;
            });
        }, 500);
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

