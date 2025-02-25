import fetchApi from "../services/fetchApi";
import { textToHSL } from "../utils/colorGenerator";
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
            libelle: text,
        };

        convertedTimetable.push(converter);
    });

    convertedTimetable.forEach((course) => {
        const day = course.startCourse.date;
        if (!finalTimetable[day]) {
            finalTimetable[day] = [];
        }
        const [h, s, l] = textToHSL(course.libelle);

        course["color"] = `hsl(${h}, ${s}%, ${l}%)`;

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

    timetableData.forEach((data) => {
        const startTimes = data.courses.map((course) =>
            toMilliseconds(...course.startCourse.time.split(":"))
        );
        const endTimes = data.courses.map((course) =>
            toMilliseconds(...course.endCourse.time.split(":"))
        );

        const first = Math.min(...startTimes);
        const last = Math.max(...endTimes);
        const interval = last - first;

        hours[data.date] = { first, last, interval };
    });

    timetableData.forEach((data, index) => {
        data.courses.forEach((course, i) => {
            const startMs = toMilliseconds(...course.startCourse.time.split(":"));
            const endMs = toMilliseconds(...course.endCourse.time.split(":"));

            const placing = getTimePercentage(
                course.startCourse.time,
                hours[data.date].first,
                hours[data.date].interval
            );
            const height = ((endMs - startMs) / hours[data.date].interval) * 100;

            timetableData[index].courses[i].height = height;
            timetableData[index].courses[i].placing = placing;
        });
    });
}

export default async function getTimetable(token) {
    const timetableResponse = await fetchApi(
        "https://api.ecoledirecte.com/v3/E/{USER_ID}/emploidutemps.awp?verbe=get&{API_VERSION}",
        {
            body: {
                dateDebut: "2025-02-10", // dynamique
                dateFin: "2025-02-16", // dynamique
                avecTrous: false,
            },
            headers: {
                "X-Token": token,
            },
        }
    );

    const timetable = convertData(await timetableResponse.data);
    const sizedTimetable = sizeTimetable(timetable);
    console.log(sizedTimetable);
    return timetable;
}

