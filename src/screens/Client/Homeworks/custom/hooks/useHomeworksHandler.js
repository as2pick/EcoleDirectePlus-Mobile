import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { routesNames } from "../../../../../router/config/routesNames";
import Homeworks from "../classes/Homeworks";
import { useHomework } from "../context/LocalContext";
import { useHomeworkUpdate } from "./useHomeworkUpdate";

export const useHomeworksHandler = ({
    state,

    setModalOpen,
    setCustomHomeworksData,
}) => {
    const navigation = useNavigation();
    const { updateHomeworkStatusDone } = useHomeworkUpdate();

    const { dispatch } = useHomework();
    useEffect(() => {
        if (state.homeworksData) {
            navigation.navigate(routesNames.client.homeworks.details, {
                homeworksData: state.homeworksData,
            });
            // dispatch({ type: "RESET_HOMEWORK_DETAILS" });
        }
    }, [state.homeworksData, navigation]);

    useEffect(() => {
        if (state.toggle) {
            updateHomeworkStatusDone(
                state.toggle.id,
                state.toggle.isCustom,
                state.toggle.updates
            );
            dispatch({ type: "RESET" });
        }
    }, [state.toggle, updateHomeworkStatusDone]);
    useEffect(() => {
        if (state.new.modalOpen !== undefined) {
            setModalOpen(state.new.modalOpen);
        }
    }, [setModalOpen, state.new.modalOpen]);
    useEffect(() => {
        const { discipline, date, content, md5Key } = state.new;
        if (discipline && date && content) {
            const homework = new Homeworks({
                discipline,
                date: date,
                homeworksContent: { content: content },
                isEvaluation: false,
                customHomeworkMd5Key: md5Key,
                id: hashToNumberInRange(14000, 19998, md5Key),
                isCustom: true,
            });

            setCustomHomeworksData((prev) => [...prev, homework.getHomework()]);
            dispatch({ type: "RESET" });
        }
    }, [state.new.discipline, state.new.date, state.new.content]);
};

const hashToNumberInRange = (min, max, hash) => {
    const hashInt = parseInt(hash.substring(0, 8), 16);

    return min + (hashInt % (max - min + 1));
};

