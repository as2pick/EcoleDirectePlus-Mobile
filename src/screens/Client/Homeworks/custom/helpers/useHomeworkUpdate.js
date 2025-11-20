// Dans ton hook useHomeworkUpdate.js
import { useCallback } from "react";
import { useUser } from "../../../../../context/UserContext";
import { storageManager } from "../../../../../helpers/StorageManager";
import { toggleHomework } from "../../../../../resolver/homeworks";

export const useHomeworkUpdate = () => {
    const { setSortedHomeworksData, userAccesToken } = useUser();

    const updateHomework = useCallback(
        (homeworkId, updates) => {
            setSortedHomeworksData((prev) => {
                const { isDone } = updates;
                const updated = { ...prev };

                Object.keys(updated).forEach((date) => {
                    if (date === "formatedDates") return;

                    updated[date] = updated[date].map((hw) =>
                        hw.id === homeworkId ? { ...hw, ...updates } : hw
                    );
                });

                storageManager.scheduleUpdateData("homeworks", updated);

                if (updated != null) {
                    toggleHomework({
                        token: userAccesToken,
                        id: homeworkId,
                        state: isDone,
                    });
                }
                return updated;
            });
        },
        [setSortedHomeworksData, userAccesToken]
    );

    return { updateHomework };
};
