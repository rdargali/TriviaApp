function displayPreview(quiz) {
    // function to preview a quiz

    //a Quiz is an object with:
    //name(string)
    //owner(string)
    //quizQuestions[] (Question)

    //a Question is an object with
    // text(string)
    // answers[] (string)

    const quizDiv = document.getElementById('quizDiv');

    // add header info
    quizName = `<div>${quiz.name}</div>`;
    quizOwner =  `<div>${quiz.owner}</div>`;

    for q in quiz.quizQuestions {
        // add each question
        questionHTML = `<div><div>${q.text}</div>`;
        answersHTML = ''
        for a in q.answers {
            
        }
        closingHTML = `</div>`

    }

    quizHTML = `${quizName}${quizOwner}`;

    quizDiv.innerHTML = quizHTML;
}

