import { SafeAreaView } from "react-native-safe-area-context";
import RenderHTML from "react-native-render-html";
import InDev from "@/components/display/InDev";
import { useMessaging } from "@/features/messaging";
import { useUserStore } from "@/hooks/useUserStore";
import { View } from "react-native";
import { useTabPadding } from "@/hooks/useTabPadding";

export default function MessagingScreen() {
    const token = useUserStore((state) => state.token);
    const tabPadding = useTabPadding();

    const { data, isLoading } = useMessaging(token);

    return (
        <SafeAreaView style={{ flex: 1, paddingBottom: tabPadding }}>
            <InDev />
        </SafeAreaView>
    );
}

