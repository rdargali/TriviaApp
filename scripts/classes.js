class Quiz {
    constructor(quizName, quizOwner) {
        this.name = quizName;
        this.owner = quizOwner;
        this.questions = [];
    }
}

class Question {
    constructor(questionText) {
        this.text = questionText;
        this.answers = [];
    }
}