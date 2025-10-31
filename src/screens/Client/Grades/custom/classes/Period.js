import { parseNumber } from "../../../../../utils/grades/makeAverage";
import { objectsEqual } from "../../../../../utils/json";
import Discipline from "./Discipline";
import Grade from "./Grade";

export default class Period {
    constructor(
        { groups, globalStreakScore = null, periodName = null },
        periodCode
    ) {
        this.groups = groups;
        this.periodCode = periodCode;
        this.globalStreakScore = globalStreakScore;
        this.periodName = periodName;
    }

    makeGeneralAverage() {
        // get all disciplines from all groups (in one array)
        const disciplines = this.groups.flatMap((group) =>
            group.isDisciplineGroup ? group.disciplines : [group]
        );
        // use acuumulator to add averages and coef in one var - is like a loop
        const { total, totalCoef } = disciplines.reduce(
            (acc, discipline) => {
                const disciplineObj = new Discipline(discipline);
                const average = disciplineObj.getWeightedAverage();
                const coef = disciplineObj.getTotalCoef();

                if (!isNaN(average) && !isNaN(coef) && coef > 0) {
                    acc.total += average * coef;
                    acc.totalCoef += coef;
                }

                return acc;
            },
            { total: 0, totalCoef: 0 }
        );

        const average = totalCoef === 0 ? null : total / totalCoef;

        return parseNumber(average);
    }

    makeDisciplineAverage(disciplineCode) {
        let disciplineSearched = null;

        // 1. search discipline
        for (const group of this.groups) {
            const disciplines = group.isDisciplineGroup
                ? group.disciplines
                : this.groups;

            const found = disciplines.find((d) => d.code === disciplineCode);
            if (found) {
                disciplineSearched = found;
                break;
            }
        }

        // 2.check if discipline was founded
        if (!disciplineSearched) {
            // here there's not discipline found
            return null; // ou throw Error / return 0 / return 'N/A'
        }

        // 3. calculate weighted average
        const discipline = new Discipline(disciplineSearched);
        return discipline.getWeightedAverage();
    }

    createReferentialStreakScore() {
        const ref = {};
        const disciplines = this.groups.flatMap((group) =>
            group.isDisciplineGroup ? group.disciplines : [group]
        );
        ref[this.periodCode] = {};

        disciplines.forEach(({ code }) => {
            ref[this.periodCode][code] = 0;
        });

        return ref;
    }

    getPeriodDatas() {
        let infos = {
            numberOfGroups: 0,
            numberOfDisciplines: 0,
        };
        this.groups.forEach((group) => {
            if (group.isDisciplineGroup) {
                infos.numberOfGroups++;
                infos.numberOfDisciplines += group.disciplines.length;
            } else {
                infos.numberOfDisciplines += group.length;
            }
        });

        return {
            periodCode: this.periodCode,
            generalAverage: this.makeGeneralAverage(),
            ...infos,
        };
    }
    injectGrade(rawGrade) {
        const grade = new Grade(rawGrade);
        const periodDisciplines = this.groups.flatMap((group) =>
            group.isDisciplineGroup ? group.disciplines : [group]
        );

        const discipline = periodDisciplines.find(
            ({ code }) => code === grade.codes.discipline
        );

        if (!discipline) {
            console.warn(
                `"${grade.codes.discipline}" not found in ${this.periodCode}`
            );
            return false;
        }

        if (!Array.isArray(discipline.grades)) {
            discipline.grades = [];
        }

        discipline.grades.push(grade);
    }
    removeGrade(rawGrade) {
        const grade = new Grade(rawGrade);

        const periodDisciplines = this.groups.flatMap((group) =>
            group.isDisciplineGroup ? group.disciplines : [group]
        );

        const discipline = periodDisciplines.find(
            ({ code }) => code === grade.codes.discipline
        );

        if (!Array.isArray(discipline.grades) || discipline.grades.length === 0) {
            console.warn(`Any grade to delete for ${discipline.code}`);
            return false;
        }
        const initialLength = discipline.grades.length;
        const gradeObj = grade.getGrade();
        discipline.grades = discipline.grades.filter(
            (g) => !objectsEqual(new Grade(g).getGrade(), gradeObj)
        );

        if (discipline.grades.length === initialLength) {
            console.warn(
                `Any grades for "${grade.disciplineName}" was found for ${discipline.code}`
            );
            return false;
        }
        console.log(
            `✅ Note "${grade.disciplineName}" supprimée de ${discipline.code}. Nouvelle moyenne : ${discipline.currentAverage}`
        );
    }
}

