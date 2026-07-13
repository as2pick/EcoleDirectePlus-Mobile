export interface ApiTimetableCourse {
    id: number;
    text: string;
    start_date: string;
    end_date: string;
    prof?: string;
    salle?: string;
    classe?: string;
    groupe?: string;
    dispense: number;
    isModifie: boolean;
    isAnnule: boolean;
}

export interface CourseTime {
    date: string;
    time: string;
}

export interface FormattedCourse {
    webId: string;
    isEdited: boolean;
    isCancelled: boolean;
    isDispensed: boolean;
    startCourse: CourseTime;
    endCourse: CourseTime;
    teacher?: string;
    room?: string;
    classGroup?: string;
    group?: string;
    libelle: string;

    color: string;
    textColor: string;

    height: number;
    placing: number;
}

export interface TimetableDay {
    date: string;
    iSODate: string;
    isJustNoon: boolean;
    courses: FormattedCourse[];
}

export interface TimetableResolverParams {
    token: string;
    offset?: number;
}

