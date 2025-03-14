const makeUniqueIds = (arr) => {
    const seen = new Set();

    return arr.map((num) => {
        while (seen.has(num)) {
            num++;
        }
        seen.add(num);
        return num;
    });
};

export const getCourseWithWebId = (wantedWebId, timetableObj) => {
    let wantedCourse = null;
    timetableObj.forEach((day) => {
        day.courses.forEach((course, i) => {
            if (course.webId === wantedWebId) {
                wantedCourse = course;
            }
        });
    });
};

export default makeUniqueIds;

