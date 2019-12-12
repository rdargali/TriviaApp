let qindex = 0;
let playerObj = null;
let playerRef = null;

function start(response, mode = 'S') {
    // response is quiz data from the trivia API
    // mode is a character indicating play mode:
    // 'M' = multiplayer
    // 'S' = single (leader) player
    // 'B' = multiplayer + admin is playing

    // ensure we are starting with a clean slate for a new game
    qindex = 0;
    playerObj = null;
    playerRef = null;

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
    // TODO tell players where to go to join the game
    questionnum.innerHTML = '---';
    question.innerHTML = `Waiting for players to join with game id ${pin}`;
    answers.style.display = 'none';
    login.style.display = 'none';
    landing.style.display = 'none';
    play.style.display = 'block';

    // set game status to JOINING
    firebase.database().ref('games/'+pin).child('question').set({text: 'JOINING', num: -1});

    if (mode != 'S') {
        firebase.database().ref('games/'+pin).child('players').on('child_added', (snapshot) => {updateUserList(snapshot)});
        if (mode == 'B') {
            // TODO: playerObj needs dynamic initialization based on number of questions
            //playerObj = {'name': appUser.email, '0': [0,-1], '1': [0,-1], '2': [0,-1], '3': [0,-1], '4': [0,-1], '5': [0,-1], '6': [0,-1], '7': [0,-1], '8': [0,-1], '9': [0,-1]};
            
            playerObj = {'name': appUser.email};
            for (let i = 0; i < myquiz.questions.length; i++) {
                let key = i.toString();
                playerObj[key] = [0, -1];
            }

            gameRef = firebase.database().ref('games/'+pin);
            playerRef = gameRef.child('players').push(playerObj);
        }
        let countdownTimeDisp = 30;
        let id = setInterval(cdown_join, 1000);
        function cdown_join() {
            questionnum.innerHTML = countdownTimeDisp;
            countdownTimeDisp -= 1;
            if (countdownTimeDisp == 0) {
                clearInterval(id);
                questionnum.innerHTML = '---';
                qLoop(pin, myquiz, playerObj)
            }
        }
    }
    else {
        // single - player mode
        // TODO: playerObj needs dynamic initialization based on number of questions
        console.log(pin);  // temporary - in single player log pin to console so i can watch DB
        //playerObj = {'name': appUser.email, '0': [0,-1], '1': [0,-1], '2': [0,-1], '3': [0,-1], '4': [0,-1], '5': [0,-1], '6': [0,-1], '7': [0,-1], '8': [0,-1], '9': [0,-1]};
        playerObj = {'name': appUser.email};
        for (let i = 0; i < myquiz.questions.length; i++) {
            let key = i.toString();
            playerObj[key] = [0, -1];
        }
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
    countdownTimeDisp = 15;
    displayQuestion(myquiz, qindex);
    answers.style.display = 'flex';
    firebase.database().ref('games/'+pin).child('question').set({text: myquiz.questions[qindex].text, qindex: qindex});
    cid = setInterval(cdown1, 1000);
    function cdown1() {
        countdown.innerHTML = countdownTimeDisp;
        countdownTimeDisp -= 1;
            if (countdownTimeDisp == 0) {
                clearInterval(cid);
            }
        }
   let id = setInterval(func, 19000);    // set for ~15 second delay; adjust countdowns above and in func() if needed!
   async function func() {
       await flashcorrect();   // flashing correct answer eats 3000 ms
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
            countdownTimeDisp = 15;
            cid = setInterval(cdown2, 1000);
            function cdown2() {
                countdown.innerHTML = countdownTimeDisp;
                countdownTimeDisp -= 1;
                if (countdownTimeDisp == 0) {
                    clearInterval(cid);
                }
            }
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

function rightAnswerButton(ev) {
    // leader clicked the right answer
    if (playerObj != null) {
        playerObj[qindex] = [1, -1];
        playerRef.set(playerObj);
    }
    // response entered - disable the buttons
    ev.target.style.borderColor = 'red';
    ev.target.style.borderWidth = '3px';
    let buttons = answers.children;
    for (let i=0; i<buttons.length; i++) {
        buttons[i].firstChild.disabled = 'true';
        //buttons[i].firstChild.style.color = 'lightgray';
    }
}

function wrongAnswerButton(ev) {
    // leader clicked the wrong answer
    // just disable the buttons
    ev.target.style.borderColor = 'red';
    ev.target.style.borderWidth = '3px';
    let buttons = answers.children;
    for (let i=0; i<buttons.length; i++) {
        buttons[i].firstChild.disabled = 'true';
        //buttons[i].firstChild.style.color = 'lightgray';
    }
}

async function flashcorrect() {
    // get a handle to the correct answer button
    let correctAnswerButton = -1;
    let buttons = answers.children;
    for (let i=0; i<buttons.length; i++) {
        //console.log(buttons[i]);
        if (buttons[i].firstChild.className == "right") {
            // this is the one we want
            correctAnswerButton = i;
        }
    }
    // flash it green 3x
    for (let i=0; i<3; i++) {
        buttons[correctAnswerButton].firstChild.style.backgroundColor= 'lightgreen';
        await sleep(500);
        buttons[correctAnswerButton].firstChild.style.backgroundColor= 'blueviolet';
        await sleep(500);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
