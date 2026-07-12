import { useColorStore } from "@/hooks/useColorStore";
import { isDarkColor } from "@/utils/colorGenerator";
import { formatFrenchDate } from "@/utils/date";

export const fillHolidays = (startDateStr, endDateStr) => {
    const finalHolidaysTimetable = [];

    const holidaysCourseTemplate = {
        classGroup: undefined,
        endCourse: { time: "23:59" },
        group: undefined,
        height: 100,
        isCancelled: false,
        isDispensed: false,
        isEdited: false,
        libelle: "CONGÉS",
        placing: "0.00",
        room: undefined,
        startCourse: { time: "00:00" },
        teacher: undefined,
        webId: 12345,
    };
    const color = useColorStore
        .getState()
        .getOrAssignColor(holidaysCourseTemplate.libelle);
    holidaysCourseTemplate["color"] = color;
    holidaysCourseTemplate["textColor"] = isDarkColor(color)
        ? "hsl(0, 100%, 100%)"
        : "hsl(0, 0%, 0%)";

    let dateList = [];
    let startDate = new Date(startDateStr);
    let endDate = new Date(endDateStr);
    while (startDate <= endDate) {
        const year = startDate.getFullYear();
        const month = String(startDate.getMonth() + 1).padStart(2, "0");
        const day = String(startDate.getDate()).padStart(2, "0");
        const dateString = `${year}-${month}-${day}`;
        dateList.push(dateString);
        const iSOFrenchDate = formatFrenchDate(dateString);
        holidaysCourseTemplate["startCourse"].date = dateString;
        holidaysCourseTemplate["endCourse"].date = dateString;

        const holidaysDay = {
            courses: [holidaysCourseTemplate],
            date: dateString,
            iSODate: iSOFrenchDate,
            isJustNoon: false,
        };

        finalHolidaysTimetable.push(holidaysDay);

        startDate.setDate(startDate.getDate() + 1);
    }
    return finalHolidaysTimetable;
};
