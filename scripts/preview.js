function displayPreview(quiz) {
    // function to preview a quiz

    //a Quiz is an object with:
    //name(string)
    //owner(string)
    //quizQuestions[] (Question)

    //a Question is an object with
    // text(string)
    // answers[] (string)

    const question = document.getElementById('question');
    const answers = document.getElementById('answers');

    // add header info
    // where is this going to go??

    for (let i = 0; i < quiz.questions.length; i++) {
        // add each question
        q = quiz.questions[i];
        question.innerHTML = q.text;
        answer_elements = answers.children; 
        for (let j = 0; j < q.answers.length; j++) {
            a = q.answers[j];
            answer_elements[j].innerHTML = a;
        }
    }
}
