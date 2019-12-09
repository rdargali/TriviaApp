//elements
let registerEmailTextBox = document.getElementById("registerEmailTextBox");
let registerPasswordTextBox = document.getElementById(
  "registerPasswordTextBox"
);
let registerButton = document.getElementById("registerButton");

let logInEmailTextBox = document.getElementById("logInEmailTextBox");
let logInPasswordTextBox = document.getElementById("logInPasswordTextBox");
let logInButton = document.getElementById("logInButton");

let logOutButton = document.getElementById("logOutButton");

//register button
registerButton.addEventListener("click", () => {
  let email = registerEmailTextBox.value;
  let password = registerPasswordTextBox.value;

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
});

//log in button

logInButton.addEventListener("click", () => {
  let email = logInEmailTextBox.value;
  let password = logInPasswordTextBox.value;

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
});

//log out button

logOutButton.addEventListener("click", () => {
  firebase
    .auth()
    .signOut()
    .then(function() {})
    .catch(function(error) {
      // An error happened.
    });
});
