import { CONFIG } from "../constants/config";
import fetchApi from "../services/fetchApi";
import { isDarkColor, textToHSL } from "../utils/colorGenerator";
import {
    addDaysToDateString,
    formatFrenchDate,
    getPreviousMonday,
} from "../utils/date";
import { toMilliseconds } from "../utils/time";
import makeUniqueIds from "../utils/uniqueIds";

const convertData = (arrayData = []) => {
    const convertedTimetable = [];
    const finalTimetable = {};
    const ids = makeUniqueIds(arrayData.map((course) => course.id));

    arrayData.forEach((element, indexElement) => {
        const {
            text,
            start_date,
            end_date,
            prof,
            salle,
            classe,
            groupe,
            dispense,
            isModifie,
            isAnnule,
        } = element;

        const converter = {
            webId: ids[indexElement],
            isEdited: isModifie,
            isCancelled: isAnnule,
            isDispensed: Boolean(dispense),
            startCourse: {
                date: start_date.split(" ")[0],
                time: start_date.split(" ")[1],
            },
            endCourse: {
                date: end_date.split(" ")[0],
                time: end_date.split(" ")[1],
            },
            teacher: prof && prof.trim() === "" ? undefined : prof,
            room: salle && salle.trim() === "" ? undefined : salle,
            classGroup: classe && classe.trim() === "" ? undefined : classe,
            group: groupe && groupe.trim() === "" ? undefined : groupe,
            libelle: text.toUpperCase(),
        };

        convertedTimetable.push(converter);
    });
    convertedTimetable.forEach((course) => {
        const day = course.startCourse.date;
        if (!finalTimetable[day]) {
            finalTimetable[day] = [];
        }
        const [h, s, l] = textToHSL({ text: course.libelle });

        course["color"] = `hsl(${h}, ${s}%, ${l}%)`;

        course["textColor"] = isDarkColor(course.color)
            ? "hsl(0, 100%, 100%)"
            : "hsl(0, 0%, 0%)";

        finalTimetable[day].push(course);
    });

    Object.keys(finalTimetable).forEach((date) => {
        finalTimetable[date].sort((a, b) => {
            const [ah, am] = a.startCourse.time.split(":").map(Number);
            const [bh, bm] = b.startCourse.time.split(":").map(Number);
            return ah * 60 + am - (bh * 60 + bm);
        });
    });

    const sortedDays = Object.keys(finalTimetable).sort(
        (a, b) => new Date(a) - new Date(b)
    );

    return sortedDays.map((day) => ({
        date: day,
        courses: finalTimetable[day],
    }));
};

function getTimePercentage(time, startDayTime, interval) {
    const [hours, minutes] = time.split(":").map(Number);
    const msTime = hours * 3600000 + minutes * 60000;
    return (((msTime - startDayTime) / interval) * 100).toFixed(2);
}

function sizeTimetable(timetableData = []) {
    const hours = {};
    const maxTime = [];
    const minTime = [];

    timetableData.forEach((data, index) => {
        const startTimes = data.courses.map((course) =>
            toMilliseconds(course.startCourse.time)
        );
        const endTimes = data.courses.map((course) =>
            toMilliseconds(course.endCourse.time)
        );

        const first = Math.min(...startTimes);
        const last = Math.max(...endTimes);
        const interval = last - first;

        hours[data.date] = { first, last, interval };
        first !== 0 ? minTime.push(first) : null;

        timetableData[index]["isJustNoon"] = last <= CONFIG.middleNoonCourseTime;

        maxTime.push(last);
    });

    timetableData.forEach((data, index) => {
        data.courses.forEach((course, i) => {
            const startMs = toMilliseconds(course.startCourse.time);
            const endMs = toMilliseconds(course.endCourse.time);

            const placing = getTimePercentage(
                course.startCourse.time,
                hours[data.date].first,
                hours[data.date].interval
            );

            const height = ((endMs - startMs) / hours[data.date].interval) * 100;

            timetableData[index].courses[i].height = timetableData[index].isJustNoon
                ? height / 2.5 // to limit size (for ex wednesday 8h -> 12h so is splitted to middle (environ))
                : height; // else normal
            timetableData[index].courses[i].placing = timetableData[index].isJustNoon
                ? placing / 2.5 // to limit size (for ex wednesday 8h -> 12h so is splitted to middle (environ))
                : placing; // else normal
        });
    });
    return timetableData;
}

const otherEdits = (timetableData = []) => {
    timetableData.forEach((_, index) => {
        timetableData[index]["iSODate"] = formatFrenchDate(
            timetableData[index].date
        );
    });

    return timetableData;
};

const fillHolidays = (startDateStr, endDateStr) => {
    const finalHolidaysTimetable = [];

    const holidaysCourseTemplate = {
        classGroup: undefined,
        // color: "hsl(229, 50%, 77%)",
        endCourse: { /*date: "2025-12-22", added dynamicly*/ time: "23:59" },
        group: undefined,
        height: 100,
        isCancelled: false,
        isDispensed: false,
        isEdited: false,
        libelle: "CONGÉS",
        placing: "0.00",
        room: undefined,
        startCourse: { /*date: "2025-12-22",*/ time: "00:00" },
        teacher: undefined,
        // textColor: "hsl(0, 0%, 0%)",
        webId: 12345,
    }; // pushed in array
    const [h, s, l] = textToHSL({ text: holidaysCourseTemplate.libelle });

    holidaysCourseTemplate["color"] = `hsl(${h}, ${s}%, ${l}%)`;

    holidaysCourseTemplate["textColor"] = isDarkColor(
        holidaysCourseTemplate.color /* added with previous line */
    )
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

const sortedTimetable = async (timetable) => {
    const newTimetable = convertData(await timetable);
    const sizedTimetable = sizeTimetable(newTimetable);

    const finalSortedTimetable = otherEdits(sizedTimetable);

    return finalSortedTimetable;
};

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

    return !timetableResponse
        ? fillHolidays(requestedMonday, addDaysToDateString(requestedMonday, 13))
        : await sortedTimetable(timetableResponse.data);
}

