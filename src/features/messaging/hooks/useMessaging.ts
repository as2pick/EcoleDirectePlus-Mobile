import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import messagingResolver, {
    messageContentResolver,
} from "@/features/messaging/resolver/messaging";
import { ResolvedMessaging, MessageContent } from "../types";

export interface UseMessagingOptions {
    typeRecuperation?: "received" | "sent" | "draft" | "archived";
    idClasseur?: number;
    itemsPerPage?: number;
}

export function useMessaging(token: string, options: UseMessagingOptions = {}) {
    const {
        typeRecuperation = "received",
        idClasseur = 0,
        itemsPerPage = 20,
    } = options;

    return useInfiniteQuery<ResolvedMessaging>({
        queryKey: ["messaging", typeRecuperation, idClasseur],
        queryFn: ({ pageParam = 0 }) =>
            messagingResolver({
                token,
                page: pageParam as number,
                itemsPerPage,
                typeRecuperation,
                idClasseur,
            }) as Promise<ResolvedMessaging>,
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage) return undefined;

            const lastPageMessages = lastPage[typeRecuperation] || [];

            if (lastPageMessages.length < itemsPerPage) {
                return undefined;
            }

            return allPages.length;
        },
        enabled: Boolean(token),
    });
}

export function useMessageContent(
    token: string,
    messageId: number | string | undefined,
    mode: "destinataire" | "expediteur" = "destinataire"
) {
    return useQuery<MessageContent>({
        queryKey: ["message", messageId, mode],
        queryFn: () =>
            messageContentResolver({
                token,
                messageId: messageId!,
                mode,
            }) as Promise<MessageContent>,
        enabled: Boolean(token) && messageId !== undefined,
    });
}

