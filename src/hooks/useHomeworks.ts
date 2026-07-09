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
        onMutate: async ({ id }) => {
            await queryClient.cancelQueries({ queryKey: ["homeworks"] });
            const previousHomeworks = queryClient.getQueryData(["homeworks"]);

            if (previousHomeworks) {
                const updatedHomeworks = JSON.parse(JSON.stringify(previousHomeworks));
                for (const date of Object.keys(updatedHomeworks)) {
                    if (date === "formatedDates") continue;
                    if (Array.isArray(updatedHomeworks[date])) {
                        updatedHomeworks[date] = updatedHomeworks[date].map((hw: any) => {
                            if (hw.id === id) {
                                const nextIsDone = hw.isDone === "done" ? "todo" : "done";
                                return { ...hw, isDone: nextIsDone, loadingState: "loading" };
                            }
                            return hw;
                        });
                    }
                }
                queryClient.setQueryData(["homeworks"], updatedHomeworks);
            }

            return { previousHomeworks };
        },
        onError: (err, variables, context) => {
            const { id } = variables;
            const previousHomeworks = context?.previousHomeworks;

            if (previousHomeworks) {
                // 1. Immediately show the error (black state) and rollback the progress bar (isDone)
                const updatedHomeworks = JSON.parse(JSON.stringify(previousHomeworks));
                for (const date of Object.keys(updatedHomeworks)) {
                    if (date === "formatedDates") continue;
                    if (Array.isArray(updatedHomeworks[date])) {
                        updatedHomeworks[date] = updatedHomeworks[date].map((hw: any) => {
                            if (hw.id === id) {
                                return { ...hw, loadingState: "error" };
                            }
                            return hw;
                        });
                    }
                }
                queryClient.setQueryData(["homeworks"], updatedHomeworks);

                setTimeout(() => {
                    queryClient.setQueryData(["homeworks"], previousHomeworks);
                    queryClient.invalidateQueries({ queryKey: ["homeworks"] });
                }, 3000);
            }
        },
        onSettled: (data, error) => {
            if (!error) {
                queryClient.invalidateQueries({ queryKey: ["homeworks"] });
            }
        },
    });

    return {
        ...query,
        toggleHomework: mutation.mutate,
    };
}