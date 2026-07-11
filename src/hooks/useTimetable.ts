import { useQuery } from "@tanstack/react-query";
import timetableResolver from "@/resolver/timetable";

export function useTimetable(token: string, offset: number = 0) {
    return useQuery({
        queryKey: ["timetable", offset],
        queryFn: () => timetableResolver({ token, offset }),
        enabled: Boolean(token),
    });
}
