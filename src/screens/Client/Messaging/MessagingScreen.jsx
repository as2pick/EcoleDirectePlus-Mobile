import { SafeAreaView } from "react-native-safe-area-context";
import RenderHTML from "react-native-render-html";
import InDev from "@/components/display/InDev";
import { useMessaging, useMessageContent } from "@/features/messaging";
import { useUserStore } from "@/hooks/useUserStore";

export default function MessagingScreen() {
    const token = useUserStore((state) => state.token);

    const { data, isLoading } = useMessaging(token);

    return (
        <SafeAreaView>
            <InDev />
        </SafeAreaView>
    );
}

