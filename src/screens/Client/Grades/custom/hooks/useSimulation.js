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
    displayPeriode,
    setGeneralAverage,
}) => {
    const navigation = useNavigation();

    useEffect(() => {
        if (state.gradeData) {
            const discipline = renderDisciplinesArray.find(
                ({ code }) => code === state.gradeData.codes.discipline
            );

            navigation.navigate(routesNames.client.grades.details, {
                gradeData: state.gradeData,
                disciplineData: discipline,
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
            // get Grade methods
            const gradeToDelete = new Grade(state.gradeToRemove);

            // find the wanted discipline to calculate new discipline average
            const disciplineToUpdate = renderDisciplinesArray.find(
                (discipline) => discipline.code === gradeToDelete.codes.discipline
            );

            // get Discipline methods
            const duplicatedDiscipline = new Discipline(disciplineToUpdate);
            duplicatedDiscipline.removeGrade(gradeToDelete.getGrade());
            // IMPORTANT getGrade because without is makes confusion with object so use is :)

            // get Period methods
            const periodToUpdate = new Period(displayPeriode);
            periodToUpdate.removeGrade(gradeToDelete.getGrade());
            // IMPORTANT getGrade because without is makes confusion with object so use is :)

            const updatedRenderDisciplines = renderDisciplinesArray.map(
                (discipline) => {
                    if (discipline.code === gradeToDelete.codes.discipline) {
                        return {
                            ...duplicatedDiscipline.getDiscipline(),

                            averageDatas: {
                                ...discipline.averageDatas,
                                userAverage:
                                    // update new discipline average
                                    duplicatedDiscipline.getWeightedAverage(), // same :)
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
                periodToUpdate.makeGeneralAverage() /* set new general average */
            );
            dispatch({ type: "CLEAR_SIMULATED_GRADE" });
        }
    }, [state.gradeToRemove]);

    useEffect(() => {
        if (state.simulatedGrade) {
            // get Grade methods
            const simulatedGrade = new Grade(state.simulatedGrade);
            // find the wanted discipline to calculate new discipline average
            const disciplineToUpdate = renderDisciplinesArray.find(
                (discipline) => discipline.code === simulatedGrade.codes.discipline
            );
            // get Discipline methods
            const duplicatedDiscipline = new Discipline(disciplineToUpdate);
            duplicatedDiscipline.injectGrade(simulatedGrade.getGrade());
            // IMPORTANT getGrade because without is makes confusion with object so use is :)

            // get Period methods
            const updatedPeriod = new Period(displayPeriode);
            updatedPeriod.injectGrade(simulatedGrade.getGrade());
            // IMPORTANT getGrade because without is makes confusion with object so use is :)

            const updatedRenderDisciplines = renderDisciplinesArray.map(
                (discipline) => {
                    if (discipline.code === simulatedGrade.codes.discipline) {
                        return {
                            ...duplicatedDiscipline.getDiscipline(), // same :)
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
        }
    }, [state.simulatedGrade]);
};

