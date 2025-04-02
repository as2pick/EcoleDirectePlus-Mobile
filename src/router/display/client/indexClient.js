import DashboardIcon from "../../../../assets/svg/navigation/DashboardIcon";
import GradesIcon from "../../../../assets/svg/navigation/GradesIcon";
import HomeworksIcon from "../../../../assets/svg/navigation/HomeworksIcon";
import MessagingIcon from "../../../../assets/svg/navigation/MessagingIcon";
import TimetableIcon from "../../../../assets/svg/navigation/TimetableIcon";
import GradesScreen from "../../../screens/Client/Grades/GradesScreen";
import HomeScreen from "../../../screens/Client/Home/HomeScreen";
import HomeworksScreen from "../../../screens/Client/Homeworks/HomeworksScreen";
import MessagingScreen from "../../../screens/Client/Messaging/MessagingScreen";
import TimetableScreen from "../../../screens/Client/Timetable/TimetableScreen";
import { routesNames } from "../../config/routesNames";
import createScreen from "../../helpers/createScreen";

const {
    client: { grades, home, homeworks, messaging, timetable },
} = routesNames;

const clientScreens = [
    createScreen(grades, GradesScreen, {
        inNavbar: true,
        icon: GradesIcon,
    }),
    createScreen(homeworks, HomeworksScreen, {
        inNavbar: true,
        icon: HomeworksIcon,
    }),
    createScreen(home, HomeScreen, {
        inNavbar: true,
        icon: DashboardIcon,
    }),
    createScreen(timetable.group, TimetableScreen, {
        inNavbar: true,
        icon: TimetableIcon,
    }),
    createScreen(messaging, MessagingScreen, {
        inNavbar: true,
        icon: MessagingIcon,
    }),
];

export default clientScreens;

