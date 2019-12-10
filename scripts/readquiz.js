function readquiz(title, owner, quiz_obj) {
    // inputs:
    // title(string) - quiz name
    // owner(string) - who owns this quiz 
    // quiz_json(object) - quiz questions & answers in json object format
    // output: a Quiz object representing this quiz
    let quiz = new Quiz(title, owner);
    
    // getting an object from home.js so don't need to parse
    //let quiz_info = JSON.parse(quiz_json);
    
    for (let i=0; i<quiz_obj.results.length; i++) {
        let q = new Question();
        q.text = quiz_obj.results[i].question;
        q.answers.push(quiz_obj.results[i].correct_answer);
        q.answers.push(quiz_obj.results[i].incorrect_answers[0]);
        q.answers.push(quiz_obj.results[i].incorrect_answers[1]);
        q.answers.push(quiz_obj.results[i].incorrect_answers[2]);
        quiz.questions.push(q)
    }

    return quiz;
}
