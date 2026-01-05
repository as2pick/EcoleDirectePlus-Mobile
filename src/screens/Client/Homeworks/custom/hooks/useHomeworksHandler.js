import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { routesNames } from "../../../../../router/config/routesNames";
import { formatDate } from "../../../../../utils/date";
import Homeworks from "../classes/Homeworks";
import { useHomeworkUpdate } from "./useHomeworkUpdate";

export const useHomeworksHandler = ({ state, dispatch, setModalOpen }) => {
    const navigation = useNavigation();
    const { updateHomework } = useHomeworkUpdate();

    useEffect(() => {
        if (state.homeworksData) {
            navigation.navigate(routesNames.client.homeworks.details, {
                homeworksData: state.homeworksData,
            });
            // dispatch({ type: "RESET_HOMEWORK_DETAILS" });
        }
    }, [state.homeworksData, navigation, dispatch]);

    useEffect(() => {
        if (state.toggle) {
            updateHomework(state.toggle.id, state.toggle.updates);
        }
    }, [state.toggle, updateHomework]);
    useEffect(() => {
        if (state.new.modalOpen !== undefined) {
            setModalOpen(state.new.modalOpen);
        }
    }, [setModalOpen, state.new.modalOpen]);
    useEffect(() => {
        const { discipline, date, content } = state.new;
        if (discipline && date && content) {
            const homework = new Homeworks({
                discipline,
                givenOn: formatDate(new Date(), "ed"),
                homeworksContent: content,
                isEvaluation: false,
            });
            // write in storage
            lazySaveCustomUserData("#custom_homeworks", homework.getHomework()); // test this !!
        }
    }, [state.new.discipline, state.new.date, state.new.content]);
};

