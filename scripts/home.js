let numberOfQuestions = document.getElementById("numberOfQuestions")
let categoryMenu = document.getElementById("categoryMenu")
let difficultyLevel = document.getElementById("difficulty")
let questionType = document.getElementById("questionType")
let goButton = document.getElementById("getem")

goButton.addEventListener("click", () => {
    let amount = ""
    if(numberOfQuestions.value != "") {
        amount = `amount=${numberOfQuestions.value}`
    }
    let category = ""
    if(categoryMenu.value != "") {
        category = `&category=${categoryMenu.value}`
    }
    let difficulty = ""
    if(difficultyLevel.value != "") {
        difficulty = `&difficulty=${difficultyLevel.value}`
    }
    let type = ""
    if(questionType.value != "") {
        type = `&type=${questionType.value}`
    }
    let triviaURL = `https://opentdb.com/api.php?${amount}${category}${difficulty}${type}`
    getTrivia(triviaURL)
})

async function getTrivia(url) {
    let rawResponse = await fetch(url)
    let response = await rawResponse.json()
    // Trivia JSON HERE!!!!
    //console.log(response)

    //use previewquiz(response) to launch previewer here or start(response) to launch a game here...
    //previewquiz(response);
    start(response);
}

async function getCategories() {
    let catURL = "https://opentdb.com/api_category.php"
    let rawResponse = await fetch(catURL)
    let response = await rawResponse.json()
    displayCats(response)
}

function displayCats(categories) {
    let triviaCategories = []
    triviaCategories.push(`<option value="">Select Category</option>`)
    categories.trivia_categories.forEach((cat) => {
        triviaCategories.push(`<option value="${cat.id}">${cat.name}</option>`)
    })
    categoryMenu.innerHTML = triviaCategories.join(" ")
}

getCategories()
