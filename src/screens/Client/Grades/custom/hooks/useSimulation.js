import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { routesNames } from "../../../../../router/config/routesNames";
import Discipline from "../classes/Discipline";
import Grade from "../classes/Grade";
import Period from "../classes/Period";

export const useSimulation = ({
    state,
    dispatch,
    displayPeriodeName,
    setSimulatedDisciplineCodes,
    setRenderDisciplineArray,
    renderDisciplinesArray,
    setSimulatedGradeDatas,
    displayPeriode,
    setGeneralAverage,
    displayPeriodeWithSimulations,
    setDisplayPeriodeWithSimulations,
}) => {
    const navigation = useNavigation();

    useEffect(() => {
        if (state.gradeData) {
            navigation.navigate(routesNames.client.grades.details, {
                gradeData: state.gradeData,
            });
            dispatch({ type: "RESET_GRADE_DETAILS" });
        }
    }, [state.gradeData, navigation, dispatch]);

    useEffect(() => {
        if (state.simulation.disciplineCode) {
            setSimulatedDisciplineCodes({
                ...state.simulation.disciplineCode,
                period: displayPeriodeName,
            });
        }
    }, [state.simulation.disciplineCode, setSimulatedDisciplineCodes]);

    useEffect(() => {
        if (state.gradeToRemove) {
            console.log(state.gradeToRemove, "to remove");
        }
    }, [state.gradeToRemove]);

    useEffect(() => {
        const updateAverages = () => {
            // get Grade methods
            const simulatedGrade = new Grade(state.simulatedGrade);
            // find the wanted discipline to calculate new discipline average
            const disciplineToUpdate = renderDisciplinesArray.find(
                (discipline) => discipline.code === simulatedGrade.codes.discipline
            );
            // get Discipline methods
            const duplicatedDiscipline = new Discipline(disciplineToUpdate);
            duplicatedDiscipline.injectGrade(simulatedGrade);

            // get Period methods
            const updatedPeriod = new Period(displayPeriode);
            updatedPeriod.injectGrade(simulatedGrade);

            const updatedRenderDisciplines = renderDisciplinesArray.map(
                (discipline) => {
                    if (discipline.code === simulatedGrade.codes.discipline) {
                        return {
                            ...discipline,
                            averageDatas: {
                                ...discipline.averageDatas,
                                userAverage:
                                    // update new discipline average
                                    duplicatedDiscipline.getWeightedAverage(),
                            },
                        };
                    } else {
                        return discipline;
                    }
                }
            );
            setRenderDisciplineArray(
                updatedRenderDisciplines /* update in render the discipline average */
            );
            setGeneralAverage(
                updatedPeriod.makeGeneralAverage() /* set new general average */
            );
        };
        if (state.simulatedGrade) {
            updateAverages();
        }
    }, [state.simulatedGrade]);
};

