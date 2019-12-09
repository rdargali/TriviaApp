myquiz = new Quiz('TestQuiz', 'Dan');

myQ1 = new Question('this is question #1');
myQ1.answers.push('Dog');
myQ1.answers.push('Bird');
myQ1.answers.push('Goldfish');
myQ1.answers.push('Cat');

myQ2 = new Question('this is question #2');
myQ2.answers.push('True');
myQ2.answers.push('False');

myquiz.questions.push(myQ1);
myquiz.questions.push(myQ2);

displayQuestion(myquiz, 0);
setTimeout(() => {
    displayQuestion(myquiz, 1);
},1500)

