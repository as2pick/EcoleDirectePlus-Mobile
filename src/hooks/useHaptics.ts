import * as Haptics from "expo-haptics";
import { useCallback } from "react";

type FeedbackType =
    "light" | "medium" | "heavy" | "selection" | "success" | "warning" | "error";

export const useHaptic = (feedbackType: FeedbackType = "selection") => {
    return useCallback(() => {
        switch (feedbackType) {
            case "light":
                return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            case "medium":
                return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            case "heavy":
                return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            case "selection":
                return Haptics.selectionAsync();
            case "success":
                return Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success
                );
            case "warning":
                return Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Warning
                );
            case "error":
                return Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Error
                );
        }
    }, [feedbackType]);
};
