/* quiz_json = `{
    "response_code": "0",
    "results": [
    {
    "category": "Entertainment: Music",
    "type": "multiple",
    "difficulty": "hard",
    "question": "Which M83 album is the song &quot;Midnight City&quot; featured in?",
    "correct_answer": "Hurry Up, We&#039;re Dreaming",
    "incorrect_answers": [
    "Saturdays = Youth",
    "Before the Dawn Heals Us",
    "Junk"
    ]
    },
    {
    "category": "Science: Computers",
    "type": "multiple",
    "difficulty": "medium",
    "question": "Which one of these is not an official development name for a Ubuntu release?",
    "correct_answer": "Mystic Mansion",
    "incorrect_answers": [
    "Trusty Tahr",
    "Utopic Unicorn",
    "Wily Werewolf"
    ]
    },
    {
    "category": "History",
    "type": "multiple",
    "difficulty": "medium",
    "question": "In what dialogue did Socrates defend himself to the court of Athens? ",
    "correct_answer": "The Apology",
    "incorrect_answers": [
    "The Euthyphro",
    "The Laws",
    "The Republic"
    ]
    }
    ]
    }`

let myquiz = readquiz('A quiz', 'Dan', quiz_json);
let qnum = 0;
displayQuestion(myquiz, qnum);
//console.log(`displaying ${qnum}`)
let id = setInterval(func, 3000);

function func() {
    qnum += 1
    if (qnum == myquiz.questions.length) {
        clearInterval(id);
    }
    else {
        displayQuestion(myquiz, qnum);
        //console.log(`displaying ${qnum}`)
    }
}

*/

function previewquiz(response) {
    // DEO - added stuff here...
    let myquiz = readquiz('Trivia API','a user',response);
    addQuiz(appUser.uid, myquiz);
    let qnum = 0;
    login.style.display = 'none';
    landing.style.display = 'none';
    play.style.display = 'block';
    displayQuestion(myquiz, qnum);
    //console.log(`displaying ${qnum}`)
    let id = setInterval(func, 3000);
    function func() {
        qnum += 1
        if (qnum == myquiz.questions.length) {
            clearInterval(id);
        }
        else {
        displayQuestion(myquiz, qnum);
        //console.log(`displaying ${qnum}`)
        }
    }
}


