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
                if(typeof element == "number") {
                    score += element
                } else {
                    name = element
                }
            }
            scores.push({
                name: name,
                score: score
            })
        }
        return scores
    })
}
