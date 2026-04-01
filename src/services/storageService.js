import AsyncStorage from "@react-native-async-storage/async-storage";

const pendingSaves = new Map();
let isSaving = false;

const layzSave = async () => {
    if (isSaving || pendingSaves.size === 0) return;

    isSaving = true;

    const toSave = new Map(pendingSaves);
    pendingSaves.clear();
    for (const [key, data] of toSave) {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(data)).then(() =>
                console.log("Lazy stored !")
            );
        } catch (e) {
            console.log("Error while lazy save: ", e);
        }
    }
    isSaving = false;
    if (pendingSaves.size > 0) {
        layzSave();
    }
};

export const lazySaveCustomUserData = (key, data) => {
    pendingSaves.set(key, data);
    layzSave();
};

