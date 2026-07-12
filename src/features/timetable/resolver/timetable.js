import { CONFIG } from "@/constants/config";
import fetchApi from "@/services/fetchApi";
import { addDaysToDateString, getPreviousMonday } from "@/utils/date";
import { sortedTimetable } from "../utils/layout";
import { fillHolidays } from "../utils/holidays";

export default async function timetableResolver({ token, offset = 0 }) {
    const baseMonday = getPreviousMonday(CONFIG.dateNow);
    const requestedMonday = addDaysToDateString(baseMonday, offset * 7);

    const timetableResponse = await fetchApi(
        `https://api.ecoledirecte.com/v3/E/{USER_ID}/emploidutemps.awp?verbe=get&{API_VERSION}`,
        {
            body: {
                dateDebut: requestedMonday,
                dateFin: addDaysToDateString(requestedMonday, 13),
                avecTrous: false,
            },
            headers: {
                "X-Token": token,
            },
            method: "POST",
        }
    );
    if (timetableResponse.isDataEmpty) {
        return {};
    }

    return !timetableResponse
        ? fillHolidays(requestedMonday, addDaysToDateString(requestedMonday, 13))
        : await sortedTimetable(timetableResponse.data);
}
