// resolvers.js
import gradesResolver from "./grades";
import homeworksResolver from "./homeworks";
import messagingResolver from "./messaging";
import timetableResolver from "./timetable";

const resolvers = {
    timetable: timetableResolver,
    homeworks: homeworksResolver,
    grades: gradesResolver,
    messaging: messagingResolver,
};
export const originName = ["timetable", "homeworks", "grades", "messaging"];

export default resolvers;

