import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { useUser } from "../../../../../context/UserContext";
import { routesNames } from "../../../../../router/config/routesNames";
import { createHomework } from "../../utils";
import { useHomework } from "../context/LocalContext";
import { useHomeworkUpdate } from "./useHomeworkUpdate";

export const useHomeworksHandler = ({ setModalOpen }) => {
    const navigation = useNavigation();
    const { setSortedHomeworksData, setCustomHomeworksData } = useUser();
    const { state, dispatch } = useHomework();
    const { updateHomeworkStatusDone } = useHomeworkUpdate();

    useEffect(() => {
        if (state.homeworksData) {
            navigation.navigate(routesNames.client.homeworks.details, {
                homeworksData: state.homeworksData,
            });
            dispatch({ type: "RESET" });
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
        if (!discipline || !date || !content) return;

        const homework = createHomework({
            discipline,
            date,
            homeworksContent: { content },
            isEvaluation: false,
            customHomeworkMd5Key: md5Key,
            id: hashToNumberInRange(14000, 19998, md5Key),
            isCustom: true,
        });

        setCustomHomeworksData((prev) => [...prev, homework]);
        dispatch({ type: "RESET" });
    }, [state.new.discipline, state.new.date, state.new.content]);

    useEffect(() => {
        if (!state.homeworkToRemove) return;

        const { date, id, customHomeworkMd5Key } = state.homeworkToRemove;

        setSortedHomeworksData((prev) => {
            const updated = { ...prev };
            updated[date] = prev[date].filter((hw) => hw.id !== id);
            if (updated[date].length === 0) {
                delete updated.formatedDates[date];
            }
            return updated;
        });

        setCustomHomeworksData((prev) =>
            prev.filter((hw) => hw.customHomeworkMd5Key !== customHomeworkMd5Key)
        );

        dispatch({ type: "RESET" });
    }, [state.homeworkToRemove]);
};

const hashToNumberInRange = (min, max, hash) => {
    const hashInt = parseInt(hash.substring(0, 8), 16);
    return min + (hashInt % (max - min + 1));
};

