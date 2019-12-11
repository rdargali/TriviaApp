let qindex = 0;
let playerObj = null;
let playerRef = null;

function start(response, mode = 'S') {
    // response is quiz data from the trivia API
    // mode is a character indicating play mode:
    // 'M' = multiplayer
    // 'S' = single (leader) player
    // 'B' = multiplayer + admin is playing

    // this bit needs to move into user's list handler section
    let myquiz = readquiz('Trivia API',appUser.email,response);
    addQuiz(appUser.uid, myquiz);

    // create pin for this game instance
    // TODO - make sure this pin hasn't been used here...
    let pin = '';
    for (let i=0; i < 7; i++) {
        pin = `${pin}${getRandomInt().toString()}`;
    }

    // show the play section
    login.style.display = 'none';
    landing.style.display = 'none';
    play.style.display = 'block';

    firebase.database().ref('games/'+pin).child('question').set({text: 'JOINING', num: -1});

    // TODO tell players where to go to join the game
    if (mode != 'S') {
        questionnum.innerHTML = '---';
        question.innerHTML = `Waiting for players to join with game id ${pin}`;
        answers.style.display = 'none';
        firebase.database().ref('games/'+pin).child('players').on('child_added', (snapshot) => {updateUserList(snapshot)});
        if (mode == 'B') {
            // TODO: playerObj needs dynamic initialization based on number of questions
            playerObj = {'name': appUser.email, '0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0};
            gameRef = firebase.database().ref('games/'+pin);
            playerRef = gameRef.child('players').push(playerObj);
        }
        setTimeout(()=>{qLoop(pin, myquiz, playerObj)},30000)
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
    else {
        // single - player mode
        // TODO: playerObj needs dynamic initialization based on number of questions
        playerObj = {'name': appUser.email, '0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0};
        gameRef = firebase.database().ref('games/'+pin);
        playerRef = gameRef.child('players').push(playerObj);
        users.innerHTML = `${users.innerHTML}<div>${appUser.email}</div>`;
        qLoop(pin, myquiz, playerObj);
    }
}

function qLoop(pin, myquiz, playerObj) {
    // questions loop
   // show question, record responses, if no response deem wrong - show # playing & # responded
   // if all responded move on before timeout
   displayQuestion(myquiz, qindex);
   answers.style.display = 'flex';
   firebase.database().ref('games/'+pin).child('question').set({text: myquiz.questions[qindex].text, qindex: qindex});
   let id = setInterval(func, 10000);
   function func() {
       qindex += 1;
       if (qindex == myquiz.questions.length) {
            // last question displayed...
           
            clearInterval(id);
            firebase.database().ref('games/'+pin).child('question').set({text: 'GAME_OVER', qindex: -1});    
            getScores(pin)
            questionnum.innerHTML = '---';
            question.innerHTML = `GAME_OVER`;
            answers.style.display = 'none';
            setTimeout(() => { login.style.display = 'none';
                               landing.style.display = 'block';
                               play.style.display = 'none';
                               },5000);
        }
        else {
            // show the next question
            displayQuestion(myquiz, qindex);
            firebase.database().ref('games/'+pin).child('question').set({text: myquiz.questions[qindex].text, qindex: qindex});
        }
    }
}

function updateUserList(snapshot) {
    users.innerHTML = `${users.innerHTML}<div>${snapshot.val().name}</div>`;
}
function getRandomInt() {
    // get a random integer 0 - 9
    return Math.floor(Math.random() * 10)
}

function rightAnswerButton() {
    // leader clicked the right answer
    if (playerObj != null) {
        playerObj[qindex] = 1;
        playerRef.set(playerObj);
    }
}

function wrongAnswerButton() {
    // leader clicked the wrong answer
    // do nothing...
}
