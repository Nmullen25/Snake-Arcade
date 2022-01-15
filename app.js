let snakeArray = [290, 310, 330]

var apple = 150;

let boarder = [];

var speed = 200;

let nextDir = (0);

let boardElem = document.getElementById('board');


let scoreField = document.getElementById('score');
let hiScoreField = document.getElementById('hi-score');


var countRef;
var timerRef;

let score = 0;
let highScore = 0;


function createBoarder () {
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


function renderBoard() {
    boardElem.innerHTML = '';
    for (let i = 0; i < 400; i++) {
        const boardSpace = document.createElement('div');
        boardSpace.dataset.index = i;
        if (i === snakeArray[0]) {
            boardSpace.className = 'head';
        }
        if (i === apple) {
            boardSpace.className = 'apple';
        }
        if (boarder.includes(i)) {
            boardSpace.className = 'wall'
        }
        for (let j = 1; j < snakeArray.length; j++) {
            if (i === snakeArray[j]) {
                boardSpace.className = 'body';
            }
            boardElem.appendChild(boardSpace);
        }
        
        boardElem.appendChild(boardSpace);
    }
}

let nextHead = undefined;
function checkSnake () {
    if (nextDir === 0) {
        renderBoard();
    } else if (checkGameOver()) {
        checkGameOverTrue();
    } else if (checkApple()) {
        checkAppleTrue();
    } else {
        moveSnake();
    }
}

function checkGameOver () {
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
    alertArea.innerText = "Game Over! Please Reset to Play Again.";
    clearInterval(timerRef);
}

function checkApple () {
    if (snakeArray[0] == apple) {
        return true;
    }
    return false;
}

function checkAppleTrue () {
    score += 1;
    nextHead = snakeArray[0] + (nextDir);
    let newHead = nextHead
    snakeArray.unshift(newHead);
    moveApple();
    scoreField.innerText = 'Score: ' + score;
}

function moveApple () {
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

function changeSpeed (event) {
    let newSpeed = event.target.value;
    if (newSpeed === 'easy') {
        speed = 200;
    } else if (newSpeed === 'intermediate') {
        speed = 100;
    } else if (newSpeed === 'hard') {
        speed = 75;
    }
}

function increment () {
    checkSnake();
    renderBoard();
}

let timeRemaining = 4;

function countdown() {
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
    clearInterval(countRef); 
    countRef = setInterval(countdown, 1000);
}

function restartGame() {
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
    score = 0;
    scoreField.innerText = 'Score: ' + score;
}


renderBoard();

 
window.addEventListener('keydown', event => {
    switch (event.key) {
        case "ArrowUp":
            nextDir = (-20);
            break;

        case "ArrowDown":
            
            nextDir = (+20);
            break;

        case "ArrowLeft":
            
            nextDir = (-1);
            break;

        case "ArrowRight":
            
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

