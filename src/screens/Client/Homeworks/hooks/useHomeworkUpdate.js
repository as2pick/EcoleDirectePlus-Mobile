import { useCallback } from "react";
import { useUser } from "../../../../context/UserContext";
import { storageManager } from "../../../../helpers/StorageManager";
import { toggleHomeworkInApi } from "../../../../resolver/homeworks";

export const useHomeworkUpdate = () => {
    const { setSortedHomeworksData, setCustomHomeworksData, userAccesToken } =
        useUser();

    const updateHomeworkStatusDone = useCallback(
        (homeworkId, isCustom, updates) => {
            setSortedHomeworksData((prev) => {
                const { isDone } = updates;
                const updated = { ...prev };

                Object.keys(updated).forEach((date) => {
                    if (date === "formatedDates") return;

                    updated[date] = updated[date].map((hw) =>
                        hw.id === homeworkId ? { ...hw, ...updates } : hw
                    );
                });

                if (isCustom) {
                    setCustomHomeworksData((prev) => {
                        const updated = prev.map((customHk) =>
                            customHk.id === homeworkId
                                ? { ...customHk, ...updates }
                                : customHk
                        );

                        storageManager.scheduleUpdateData(
                            "custom_homeworks",
                            updated
                        );

                        return updated;
                    });
                } else if (updated != null && !isCustom) {
                    toggleHomeworkInApi({
                        token: userAccesToken,
                        id: homeworkId,
                        state: isDone,
                    });
                }
                storageManager.scheduleUpdateData("homeworks", updated);
                return updated;
            });
        },
        [setSortedHomeworksData, setCustomHomeworksData, userAccesToken]
    );

    return { updateHomeworkStatusDone };
};

