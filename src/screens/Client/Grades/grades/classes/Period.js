import { parseNumber } from "../../../../../utils/grades/makeAverage";
import Discipline from "./Discipline";

export default class Period {
    constructor({ groups }, periodCode) {
        this.groups = groups;
        this.periodCode = periodCode;
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
}

