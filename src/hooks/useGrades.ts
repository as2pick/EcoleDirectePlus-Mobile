import { useQuery } from "@tanstack/react-query";
import gradesResolver from "@/features/grades/resolver/grades";

export function useGrades(token: string) {
    return useQuery({
        queryKey: ["grades"],
        queryFn: () => gradesResolver({ token }),
        enabled: Boolean(token),
    });
}
