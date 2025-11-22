import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { routesNames } from "../../../../../router/config/routesNames";
import { useHomeworkUpdate } from "./useHomeworkUpdate";

export const useHomeworksHandler = ({ state, dispatch }) => {
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
};

