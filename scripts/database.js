// database functions go here
function addQuiz(uid, quiz) {
    // add a quiz to the database
    db = firebase.database();
    db.ref('users/' + uid).push().set(quiz);
}

function deleteQuiz(uid, quiz) {
    // delete a quiz from the database

}
