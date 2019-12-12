let scoreboard = document.getElementById("scoreboard")

function displayScores(scores) {
    let scoreboardItems = []
    scoreboardItems.push("<ul>")
    for(let i = 0; i < scores.length; i ++) {
        scoreboardItems.push(`<li>${scores[i].name} Score: ${scores[i].score}</li>`)
    }
    scoreboardItems.push("</ul>")
    scoreboard.innerHTML = scoreboardItems.join(" ")
}

function getScores(pin) {
    let players = firebase.database().ref().child("games").child(pin).child("players")
    let scores = []

    players.on("value",(snapshot) => {
        let players = snapshot.val()
        let userIDs = Object.keys(players)
        for(let i = 0; i < userIDs.length; i++) {
            let name = ""
            let score = 0
            let id = userIDs[i]
            let playerGame = players[id]
            let playerGameKeys = Object.keys(playerGame)
            for(let j = 0; j < playerGameKeys.length; j++) {
                let element = playerGame[playerGameKeys[j]]
                // TODO - fix this for updated playerObj type
                // if(typeof element == "number") {
                //     score += element
                // } 
                // else {
                //     name = element
                // }
                // TEMP to make it run
                score = 5;
                name = 'fix_scoring.js'
            }
            scores.push({
                name: name,
                score: score
            })
        }
        displayScores(scores)
    })
}
