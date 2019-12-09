function displayQuestion(quiz,n) {
    // function to display the nth question from a quiz

    //a Quiz is an object with:
    //name(string)
    //owner(string)
    //quizQuestions[] (Question)

    //a Question is an object with
    // text(string)
    // answers[] (string)

    const questionnum = document.getElementById('questionnum');
    const question = document.getElementById('question');
    const answers = document.getElementById('answers');
    const users = document.getElementById('users');

    // add header info
    headerHTML = `<div class="col">Quiz title: ${quiz.name}</div>
                <div cl ass="col">Quiz owner: ${quiz.owner}</div>`;
    users.innerHTML = headerHTML;

    // get the nth question from this quiz
    q = quiz.questions[n];
    questionnum.innerHTML = `Question: ${n+1}`;
    question.innerHTML = q.text;

    answersHTML = [];
    for (let j = 0; j < q.answers.length; j++) {
        answersHTML.push(`<div class="col">${q.answers[j]}</div>`); 
    }
    answers.innerHTML = answersHTML.join(' ');
}
