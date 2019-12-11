function start(response) {
    // this bit needs to move into user's list handler section
    let myquiz = readquiz('Trivia API',appUser.email,response);
    addQuiz(appUser.uid, myquiz);

    // display pin and allow users to join the game
    // TODO - create random PIN and check DB here...
    let pin = '12345';
    console.log(`Pin: ${pin}`)

    login.style.display = 'none';
    landing.style.display = 'none';
    play.style.display = 'block';

    questionnum.innerHTML = '---';
    question.innerHTML = `Waiting for players to join with game id ${pin}`;
    answers.style.display = 'none';

    firebase.database().ref('games/'+pin).child('question').set({text: 'JOINING', num: -1});
    firebase.database().ref('games/'+pin).child('players').on('child_added', (snapshot) => {updateUserList(snapshot)});
    setTimeout(()=>{qLoop(pin, myquiz)},30000)
    
    let countdown = 30;
    let id = setInterval(cdown, 1000);
    function cdown() {
        questionnum.innerHTML = countdown;
        countdown -= 1;
        if (countdown == 0) {
            clearInterval(id);
        }
    }
}

function qLoop(pin, myquiz) {
    // questions loop
   // show question, record responses, if no response deem wrong - show # playing & # responded
   // if all responded move on before timeout
   let qindex = 0;
   displayQuestion(myquiz, qindex);
   answers.style.display = 'flex';
   //firebase.database().ref('games/'+pin).child('question').set({text: `Qindex: ${qindex}`, qindex: qindex});
   firebase.database().ref('games/'+pin).child('question').set({text: myquiz.questions[qindex].text, qindex: qindex});
   let id = setInterval(func, 10000);
   function func() {
       qindex += 1;
       if (qindex == myquiz.questions.length) {
            // last question displayed...
            clearInterval(id);
            firebase.database().ref('games/'+pin).child('question').set({text: 'GAME_OVER', qindex: -1});
            login.style.display = 'none';
            landing.style.display = 'block';
            play.style.display = 'none';
        }
        else {
            // show the next question
            displayQuestion(myquiz, qindex);
            //firebase.database().ref('games/'+pin).child('question').set({text: `Qindex: ${qindex}`, qindex: qindex});
            firebase.database().ref('games/'+pin).child('question').set({text: myquiz.questions[qindex].text, qindex: qindex});
        }
    }
}

function updateUserList(snapshot) {
    users.innerHTML = `${users.innerHTML}<div>${snapshot.val().name}</div>`;
}
