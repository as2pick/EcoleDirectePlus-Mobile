// useGradesEffects.js

import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { routesNames } from "../../../../../router/config/routesNames";

export const useGradesEffects = ({
    state,
    dispatch,
    displayPeriodeName,
    setSimulatedDisciplineCodes,
}) => {
    const navigation = useNavigation();

    // Effet pour la navigation vers les détails d'une note
    useEffect(() => {
        if (state.gradeData) {
            navigation.navigate(routesNames.client.grades.details, {
                gradeData: state.gradeData,
            });
            dispatch({ type: "RESET_GRADE_DETAILS" });
        }
    }, [state.gradeData, navigation, dispatch]);

    // Effet pour la simulation de discipline
    useEffect(() => {
        if (state.simulation.disciplineCode) {
            setSimulatedDisciplineCodes({
                ...state.simulation.disciplineCode,
                period: displayPeriodeName,
            });
        }
    }, [
        state.simulation.disciplineCode,
        displayPeriodeName,
        setSimulatedDisciplineCodes,
    ]);

    // Effet pour la suppression d'une note
    useEffect(() => {
        if (state.gradeToRemove) {
            console.log(state.gradeToRemove, "to remove");
            // Ajoute ici la logique pour supprimer la note
        }
    }, [state.gradeToRemove]);
};

