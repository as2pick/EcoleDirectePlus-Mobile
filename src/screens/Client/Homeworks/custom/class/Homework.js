export default class Homework {
    constructor({
        courseContent,
        discipline,
        givenOn,
        homeworksContent,
        id,
        isDone,
        isEvaluation,
        returnOnline,
        student,
    }) {
        this.courseContent = courseContent;
        this.discipline = discipline;
        this.givenOn = givenOn;
        this.homeworksContent = homeworksContent;
        this.id = id;
        this.isDone = isDone;
        this.isEvaluation = isEvaluation;
        this.returnOnline = returnOnline;
        this.student = student;
    }
    getHomework() {
        return {
            courseContent: this.courseContent,
            discipline: this.discipline,
            givenOn: this.givenOn,
            homeworksContent: this.homeworksContent,
            id: this.id,
            isDone: this.isDone,
            isEvaluation: this.isEvaluation,
            returnOnline: this.returnOnline,
            student: this.student,
        };
    }
}

