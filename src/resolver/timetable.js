import fetchApi from "../services/fetchApi";
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

    // Grouping courses by day (no nested weeks)
    convertedTimetable.forEach((course) => {
        const day = course.startCourse.date;
        if (!finalTimetable[day]) {
            finalTimetable[day] = [];
        }
        finalTimetable[day].push(course);
    });

    // Sorting the courses by start time for each day
    Object.keys(finalTimetable).forEach((date) => {
        finalTimetable[date].sort((a, b) => {
            const [ah, am] = a.startCourse.time.split(":").map(Number);
            const [bh, bm] = b.startCourse.time.split(":").map(Number);
            return ah * 60 + am - (bh * 60 + bm);
        });
    });

    // Now just returning the list of days with courses
    const sortedDays = Object.keys(finalTimetable).sort(
        (a, b) => new Date(a) - new Date(b)
    );

    return sortedDays.map((day) => ({
        date: day,
        courses: finalTimetable[day],
    }));
};

export default async function getTimetable(token) {
    const timetableResponse = await fetchApi(
        "https://api.ecoledirecte.com/v3/E/{USER_ID}/emploidutemps.awp?verbe=get&{API_VERSION}",
        {
            body: {
                dateDebut: "2025-02-10", // dynamique
                dateFin: "2025-02-17", // dynamique
                avecTrous: false,
            },
            headers: {
                "X-Token": token,
            },
        }
    );

    const timetable = convertData(await timetableResponse.data);
    return timetable;
}

