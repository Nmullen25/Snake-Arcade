// Game Variables
let snakeArray = [290, 310, 330]  // the array of the snake body parts, [0] will always be the head

var apple = 150; // Apple Position, will be changed after each eaten apple

let boarder = []; // will hold the boarder locations

var speed = 200; // speed of the snake, 100 = 1/10 of a second

let nextDir = (0); // how to move the head, can only be +1, -1, +10, -10

let boardElem = document.getElementById('board'); // select the board element

// Scoring fields
let scoreField = document.getElementById('score');
let hiScoreField = document.getElementById('hi-score');
let avgScoreField = document.getElementById('avg-score');

var countRef; // set to undefined for the counter to be cleared
var timerRef; // set to undefined for the timer to be cleared

let score = 0; // keep track of the score
let highScore = 0; // high score
let totalScore = 0; // still in progress
let pastScores = []; // still in progress
let avgScore = totalScore / pastScores.length; // still in progress

function createBoarder () {
    // create the boarder of the game, stays constant, doesnt need rendered every play
    // In order, top row, left side, right side, bottom row
    for (let i = 0; i < 21; i++) {
        boarder.push(i);
    }
    for (let j = 380; j < 400; j++) {
        boarder.push(j);
    }
    for (let k = 0; k < 380; k = k + 20) {
        boarder.push(k);
    }
    for (let l = 19; l < 400; l = l + 20) {
        boarder.push(l);
    }
}

createBoarder();

// Game Functions
function renderBoard() {
    // will be called last to render after all of the changes have been made
    boardElem.innerHTML = '';
    for (let i = 0; i < 400; i++) {
        const boardSpace = document.createElement('div'); // create the elements for the divs
        boardSpace.dataset.index = i; // adds an index for the snakeArray to show the snake position
        // add the class for the head of the snake
        if (i === snakeArray[0]) {
            boardSpace.className = 'head';
        }
        // add the class for the apple space
        if (i === apple) {
            boardSpace.className = 'apple';
        }
        if (boarder.includes(i)) {
            boardSpace.className = 'wall'
        }
        // loop though and add the class for the body of the snake
        for (let j = 1; j < snakeArray.length; j++) {
            if (i === snakeArray[j]) {
                boardSpace.className = 'body';
            }
            // add the div to the html
            boardElem.appendChild(boardSpace);
        }
        
        // add the div to the html
        boardElem.appendChild(boardSpace);
    }
}

let nextHead = undefined;
function checkSnake () {
    // move the snake based on the nextDir variable
    if (nextDir === 0) {
        renderBoard();
    } else if (checkGameOver()) {
        // check to see if game over
        checkGameOverTrue();
    } else if (checkApple()) {
        // check to see if the apple has been eaten
        checkAppleTrue();
    } else {
        // if none are true, move the snake
        moveSnake();
    }
}

function checkGameOver () {
    // check if the head of the snake has bitten or ran into a wall
    for (let i = 1; i < snakeArray.length; i++) {
        if (snakeArray[i] === snakeArray[0]) {
            return true;
        }
    }
    if (boarder.includes(snakeArray[0])) {
        return true;
    }
    return false;
}

function checkGameOverTrue () {
    nextDir = 0;
    renderBoard();
    console.log("Game Over");
    alertArea.innerText = "Game Over! Please Reset to Play Again.";
    clearInterval(timerRef);
}

function checkApple () {
    // check to see if the apple has been eaten
    if (snakeArray[0] == apple) {
        return true;
    }
    return false;
}

function checkAppleTrue () {
    score += 1;
    console.log(`new score ${score}`);
    nextHead = snakeArray[0] + (nextDir);
    let newHead = nextHead
    snakeArray.unshift(newHead);
    moveApple();
    console.log(`new apple ${apple}`);
    scoreField.innerText = 'Score: ' + score;
}

function moveApple () {
    // move the apple to a new location after the snake eats it
    apple = Math.floor(Math.random() * 400);
    validApple = false;
    if (boarder.includes(apple) || snakeArray.includes(apple)) {
        validApple = true;
    }

    while (validApple) {
        let newApple = Math.floor(Math.random() * 400);
        if (boarder.includes(newApple) || snakeArray.includes(newApple)) {
            validApple = true;
        } else {
            apple = newApple;
            validApple = false;
        }
    }
}

function moveSnake () {
    snakeArray.pop();
    nextHead = snakeArray[0] + (nextDir);
    let newHead = nextHead
    snakeArray.unshift(newHead);
}

// still working on changing the speed
function changeSpeed (event) {
    // change the speed of the snake
    let newSpeed = event.target.value;
    if (newSpeed === 'easy') {
        speed = 200;
        console.log(speed);
    } else if (newSpeed === 'intermediate') {
        speed = 100;
        console.log(speed);
    } else if (newSpeed === 'hard') {
        speed = 75;
        console.log(speed);
    }
}

function increment () {
    // base function to run the game, move the snake then render the board
    checkSnake();
    renderBoard();
}

let timeRemaining = 4;

function countdown() {
    // increment the a countdown to start the game, also sets the interval for the speed
    timeRemaining -= 1;
    alertArea.innerText = timeRemaining;
    if (timeRemaining <= 0) {
        alertArea.innerText = "Go!";
        timeRemaining = 0;
        clearInterval(timerRef);
        timerRef = setInterval(increment, speed);
        nextDir = (-20);
        clearInterval(countRef);
    } else {
        alertArea.innerText = timeRemaining;
    }
}

function gameStart () {
    // on play button press, start the countdown to begin the game
    clearInterval(countRef); 
    countRef = setInterval(countdown, 1000);

}

function restartGame() {
    // reset all of the inital start values
    snakeArray = [290, 310, 330];
    apple = 150;
    nextDir = (0);
    renderBoard();
    alertArea.innerText = "Press Play To Start!";
    timeRemaining = 4;
    if (score > highScore) {
        highScore = score;
        hiScoreField.innerText = "High Score: " + highScore;
    }
    pastScores.unshift(score);
    totalScore += score;
    score = 0;
    scoreField.innerText = 'Score: ' + score;
    // avgScoreField.innerText = 'Average Score: ' + avgScore;
}

// Set the basic beginning state of the game
// setInterval(increment, speed); // for testing purposes
renderBoard(); // First render of the game

// DOM Manipulation 
window.addEventListener('keydown', event => {
    switch (event.key) {
        case "ArrowUp":
            nextDir = (-20);
            break;

        case "ArrowDown":
            // console.log("down");
            nextDir = (+20);
            break;

        case "ArrowLeft":
            // console.log("left");
            nextDir = (-1);
            break;

        case "ArrowRight":
            // console.log("right");
            nextDir = (+1);
            break;
        default:
            break;
    }

});

let speedChange = document.getElementById('select');
speedChange.addEventListener('change', changeSpeed);

let startButton = document.getElementById('start-button');
startButton.addEventListener('click', gameStart);

let restartButton = document.getElementById('restart-button');
restartButton.addEventListener('click', restartGame);

let alertArea = document.getElementById("alert-area");

