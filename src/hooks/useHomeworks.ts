import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import homeworksResolver, { toggleHomeworkInApi } from "../resolver/homeworks";

export function useHomeworks(token: string) {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["homeworks"],
        queryFn: () => homeworksResolver({ token }),
        enabled: Boolean(token),
    });

    const mutation = useMutation({
        mutationFn: ({ id, state }: { id: number; state: boolean }) =>
            toggleHomeworkInApi({ token, id, state }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["homeworks"] });
        },
    });

    return {
        ...query,
        toggleHomework: mutation.mutate,
    };
}