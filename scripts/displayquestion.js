function displayQuestion(quiz,n) {
    // function to display the nth question from a quiz

    // a Quiz is an object with:
    // name(string)
    // owner(string)
    // quizQuestions[] (Question)

    // a Question is an object with
    // text(string)
    // answers[] (string)

    const questionnum = document.getElementById('questionnum');
    const question = document.getElementById('question');
    const answers = document.getElementById('answers');
    const users = document.getElementById('users');
    const countdown = document.getElementById('countdown');

    qindex = n;
    if (playerObj != null) {
        leaderPlayerObj = playerObj;
    }

    // add header info
    headerHTML = `<div class="col">Quiz title: ${quiz.name}</div>
                <div class="col">Quiz owner: ${quiz.owner}</div>`;
    users.innerHTML = headerHTML;

    // get the nth question from this quiz
    q = quiz.questions[n];
    questionnum.innerHTML = `Question: ${n+1}`;
    question.innerHTML = q.text;

    answersHTML = [];
    answersHTML.push(`<div class="col"><button class="right" onclick="rightAnswerButton();">${q.answers[q.correctanswer]}</button></div>`);
    for (let j = 0; j < q.answers.length; j++) {
        if (j != q.correctanswer) {
            answersHTML.push(`<div class="col"><button class="wrong" onclick="wrongAnswerButton();">${q.answers[j]}</button></div>`);
        }
    }
    shuffle(answersHTML);
    answers.innerHTML = answersHTML.join(' ');
}

function shuffle(array) {
    // use the Fisher-Yates shuffle algorithm to randomize the answers order
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    
        // swap elements array[i] and array[j] - this is the same as:
        // let t = array[i]; array[i] = array[j]; array[j] = t
        [array[i], array[j]] = [array[j], array[i]];
      }
}
