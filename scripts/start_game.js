let qindex = 0;
let playerObj = null;
let playerRef = null;
let joinedUsers = 0;
let responseCount = 0;

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
    joinedUsers = 0;
    responseCount = 0;

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
    // add header info to users element
    headerHTML = `<div class="col">Quiz title: ${myquiz.name}</div>
                <div class="col">Quiz owner: ${myquiz.owner}</div>`;
    users.innerHTML = headerHTML;
    // setup the main play section
    questionnum.innerHTML = '---';
    question.innerHTML = `Waiting for players to join with game id ${pin}`;
    answers.style.display = 'none';
    // collapse landing and show display
    login.style.display = 'none';
    landing.style.display = 'none';
    play.style.display = 'block';

    // set game status to JOINING
    firebase.database().ref('games/'+pin).child('question').set({text: 'JOINING', num: -1});

    if (mode != 'S') {
        firebase.database().ref('games/'+pin).child('players').on('child_added', (snapshot) => {updateUserList(snapshot)});
        if (mode == 'B') {
            playerObj = {'name': appUser.email};
            for (let i = 0; i < myquiz.questions.length; i++) {
                let key = i.toString();
                playerObj[key] = [0, -1];
            }
            gameRef = firebase.database().ref('games/'+pin);
            playerRef = gameRef.child('players').push(playerObj);
        }
        let countdownJoinDisp = 30;
        let id = setInterval(cdown_join, 1000);
        function cdown_join() {
            questionnum.innerHTML = countdownJoinDisp;
            countdownJoinDisp -= 1;
            if (countdownJoinDisp == 0) {
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
        playerObj = {'name': appUser.email};
        for (let i = 0; i < myquiz.questions.length; i++) {
            let key = i.toString();
            playerObj[key] = [0, -1];
        }
        gameRef = firebase.database().ref('games/'+pin);
        playerRef = gameRef.child('players').push(playerObj);
        users.innerHTML = `${users.innerHTML}<div>${appUser.email}</div>`;
        joinedUsers += 1;
        qLoop(pin, myquiz, playerObj);
    }
}

async function qLoop(pin, myquiz) {
    // this is the main game loop!
    // show a question, start countdown a timer
    // if all users have responded jump to next question
    
    // show the answer buttons
    answers.style.display = 'flex';

    // iterate over the questions in this quiz
    for (qindex = 0; qindex < myquiz.questions.length; qindex++) {
        responseCount = 0;
        // display the question
        firebase.database().ref('games/'+pin).child('question').set({text: myquiz.questions[qindex].text, qindex: qindex});
        displayQuestion(myquiz, qindex);
        await qTimer(15);
        await flashcorrect();
    }
    // no more questions
    firebase.database().ref('games/'+pin).child('question').set({text: 'GAME_OVER', qindex: -1});    
    getScores(pin);
    questionnum.innerHTML = '---';
    question.innerHTML = `GAME_OVER`;
    answers.style.display = 'none';
    setTimeout(() => { login.style.display = 'none';
                       landing.style.display = 'block';
                       play.style.display = 'none';
                       },3000);
}

async function qTimer(delaySecs) {
    // countdown timer
    let countdownTimeDisp = delaySecs;
    while (countdownTimeDisp>0) {
        countdown.innerHTML = countdownTimeDisp;
        await sleep(1000);
        countdownTimeDisp -= 1;
        // check for responses
        // TODO - fix for multiplayer
        if (responseCount == joinedUsers) {
            // if everybody has responded fast forward to end...
            countdownTimeDisp = 0;
            countdown.innerHTML = '---';
        }
    }
}

function updateUserList(snapshot) {
    users.innerHTML = `${users.innerHTML}<div>${snapshot.val().name}</div>`;
    joinedUsers += 1;
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
        // TODO - may need to disable this later
        // hack to make single player work!
        responseCount += 1;
    }
    // response entered - disable the buttons
    // ev.target.style.borderColor = 'red';
    // ev.target.style.borderWidth = '3px';
    let buttons = answers.children;
    for (let i=0; i<buttons.length; i++) {
        buttons[i].firstChild.disabled = 'true';
    }
}

function wrongAnswerButton(ev) {
    // leader clicked the wrong answer
    // just disable the buttons

    // TODO - may need to disable this later
    // hack to make single player work!
    responseCount += 1;
    ev.target.style.backgroundColor = 'red';
    // ev.target.style.borderWidth = '3px';
    // ev.target.style.opacity = '.2';
    let buttons = answers.children;
    for (let i=0; i<buttons.length; i++) {
        buttons[i].firstChild.disabled = 'true';
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
