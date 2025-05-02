import AsyncStorage from "@react-native-async-storage/async-storage";
import { isJsonObject } from "../utils/json";

const storageService = {
    // Fonction pour stocker les données
    setter: async ({ originKey, dataToStore }) => {
        if (isJsonObject(dataToStore)) {
            dataToStore = JSON.stringify(dataToStore);
        }
        await AsyncStorage.setItem(originKey, dataToStore);
    },

    getter: async ({ originKey }) => {
        const data = await AsyncStorage.getItem(originKey);
        if (data !== null) {
            try {
                return JSON.parse(data);
            } catch (error) {
                console.error("Error parsing data:", error);
                return data;
            }
        }
        return null;
    },
};

export default storageService;

