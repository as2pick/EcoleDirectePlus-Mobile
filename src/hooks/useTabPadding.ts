import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

export function useTabPadding() {
    try {
        return useBottomTabBarHeight() + 20;
    } catch (e) {
        return 0;
    }
}
