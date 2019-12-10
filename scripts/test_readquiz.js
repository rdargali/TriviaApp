function previewquiz(response) {
    // DEO - this driver code may really belong someplace else in our app...
    let myquiz = readquiz('Trivia API',appUser.email,response);
    addQuiz(appUser.uid, myquiz);
    //test delete function
    //let delQuizId = '-Lvl3y91a892fONEO-zs';
    //deleteQuiz(appUser.uid,delQuizId);
    let qnum = 0;
    login.style.display = 'none';
    landing.style.display = 'none';
    play.style.display = 'block';
    // show the first question
    displayQuestion(myquiz, qnum);
    let id = setInterval(func, 3500);
    function func() {
        qnum += 1
        if (qnum == myquiz.questions.length) {
            // last question displayed...
            clearInterval(id);
            login.style.display = 'none';
            landing.style.display = 'block'; 
            play.style.display = 'none';  
        }
        else {
            // show the next question
            displayQuestion(myquiz, qnum);
        }
    }
}


