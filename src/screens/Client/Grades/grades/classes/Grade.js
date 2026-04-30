export default class Grade {
    constructor({
        libelle,
        notSignificant,
        date,
        homeworkType,
        disciplineName,
        codes,
        data,
        skills,
        onlySkills,
        isExam,
        actionOnStreak = "nothing",
    }) {
        this.libelle = libelle;
        this.notSignificant = notSignificant;
        this.date = date;
        this.homeworkType = homeworkType;
        this.disciplineName = disciplineName;
        this.codes = codes;
        this.data = data;
        this.skills = skills;
        this.onlySkills = onlySkills;
        this.isExam = isExam;
        this.actionOnStreak = actionOnStreak;
    }

    getGrade() {
        return {
            libelle: this.libelle,
            notSignificant: this.notSignificant,
            date: this.date,
            homeworkType: this.homeworkType,
            disciplineName: this.disciplineName,
            codes: this.codes,
            data: this.data,
            skills: this.skills,
            onlySkills: this.onlySkills,
            isExam: this.isExam == undefined ? false : this.isExam,
            actionOnStreak: this.actionOnStreak,
        };
    }
}

