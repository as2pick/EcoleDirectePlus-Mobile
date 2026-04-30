import DashboardIcon from "../../../../../assets/svg/navigation/DashboardIcon";
import GradesIcon from "../../../../../assets/svg/navigation/GradesIcon";
import HomeworksIcon from "../../../../../assets/svg/navigation/HomeworksIcon";
import MessagingIcon from "../../../../../assets/svg/navigation/MessagingIcon";
import TimetableIcon from "../../../../../assets/svg/navigation/TimetableIcon";
import InDev from "../../../../components/Ui/InDev";
import HomeScreen from "../../../../screens/Client/Home/HomeScreen";
import { routesNames } from "../../../config/routesNames";
import createScreen from "../../../helpers/createScreen";

const {
    client: { grades, home, homeworks, messaging, timetable },
} = routesNames;

const tabClientScreens = [
    createScreen(grades.group, InDev, {
        inNavbar: true,
        icon: GradesIcon,
    }),
    createScreen(homeworks, InDev, {
        inNavbar: true,
        icon: HomeworksIcon,
    }),
    createScreen(home, HomeScreen, {
        inNavbar: true,
        icon: DashboardIcon,
    }),
    createScreen(timetable.group, InDev, {
        inNavbar: true,
        icon: TimetableIcon,
    }),
    createScreen(messaging, InDev, {
        inNavbar: true,
        icon: MessagingIcon,
    }),
];

export default tabClientScreens;

