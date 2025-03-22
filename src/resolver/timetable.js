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
            teacher: prof,
            room: salle,
            classGroup: classe,
            group: groupe,
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

const sortedTimetable = async (timetable) => {
    const newTimetable = convertData(await timetable);
    const sizedTimetable = sizeTimetable(newTimetable);

    const FinalSortedTimetable = otherEdits(sizedTimetable);

    return FinalSortedTimetable;
};

export default async function getTimetable(token, offset = 0) {
    const baseMonday = getPreviousMonday(CONFIG.dateNow);
    const requestedMonday = addDaysToDateString(baseMonday, offset * 7);

    const timetableResponse = await fetchApi(
        `https://api.ecoledirecte.com/v3/E/{USER_ID}/emploidutemps.awp?verbe=get&{API_VERSION}`,
        {
            body: {
                dateDebut: requestedMonday,
                dateFin: addDaysToDateString(requestedMonday, 6),
                avecTrous: false,
            },
            headers: {
                "X-Token": token,
            },
            method: "POST",
        }
    );
    // Trie et retourne l'emploi du temps de cette semaine
    return sortedTimetable(timetableResponse.data);
}

