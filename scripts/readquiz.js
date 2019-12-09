function readquiz(title, owner, quiz_json) {
    // inputs:
    // title(string) - quiz name
    // owner(string) - who owns this quiz 
    // quiz_json(string) - quiz questions & answers in json format
    // output: a Quiz object representing this quiz
    let quiz = new Quiz(title, owner);
    
    let quiz_info = JSON.parse(quiz_json);
    
    for (let i=0; i<3; i++) {
        let q = new Question();
        q.text = quiz_info.results[i].question;
        q.answers.push(quiz_info.results[i].correct_answer);
        q.answers.push(quiz_info.results[i].incorrect_answers[0]);
        q.answers.push(quiz_info.results[i].incorrect_answers[1]);
        q.answers.push(quiz_info.results[i].incorrect_answers[2]);
        quiz.questions.push(q)
    }

    return quiz;
}