import { useQuery } from "@tanstack/react-query";
import gradesResolver from "@/features/grades/resolver/grades";
import { ResolvedGrades } from "../types";

export function useGrades(token: string) {
    return useQuery<ResolvedGrades>({
        queryKey: ["grades"],
        queryFn: () => gradesResolver(token) as Promise<ResolvedGrades>,
        enabled: Boolean(token),
    });
}
