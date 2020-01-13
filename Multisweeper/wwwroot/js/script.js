var connection = new signalR.HubConnectionBuilder().withUrl("/multiplayerHub").build();

let library = new Library();

/** @type {Minefield} */
let gameBoard = library.initGamefield();

let gameDiv = document.getElementById("game");

let gameFinished = false;

for (let i=0;i<30;i++) {
    let board = gameBoard.getBoard();
    let boardRow = board[i];
    let row = document.createElement("div");
    row.className = "row";
    row.id = "" + i;
    for (let j=0;j<30;j++) {
        let field = boardRow[j];
        let box = document.createElement("div");
        box.className = "box";
        box.id = library.convertLocationToId(i, j);
        box.setAttribute('x', field.x);
        box.setAttribute('y', field.y);
        box.setAttribute('mine', field.mine);
        box.setAttribute('surroundingMines', field.surroundingMines);
        box.addEventListener('click', clickEventBox);
        row.appendChild(box);
    }
    gameDiv.appendChild(row);
}

let counterDiv = document.getElementById('counter');
counterDiv.innerHTML = gameBoard.leftEmptyFields;

let seconds = 0;
let timerDiv = document.getElementById('timer');

function incrementSeconds() {
    seconds += 1;
    timerDiv.innerText = seconds;
}

let indicatorDiv = document.getElementById('indicator');

let cancel = 0;

function startGame() {
    cancel = setInterval(incrementSeconds, 1000);
}

function clickEventBox(event) {
    clickBox(event.target);
}

function clickBox(element) {
    if (gameFinished) {
        return false;
    }

    if (element.classList.contains("revealed")) {
        return false;
    }

    if (element.attributes.getNamedItem('mine').value === "true") {
        setLostGame();
        endGame();
        element.style.backgroundColor = "#ff2e2e";
        return true;
    }

    revealBox(element);
    gameBoard.removeFromLeftEmptyFields();
    counterDiv.innerHTML = gameBoard.leftEmptyFields;
    if (gameBoard.leftEmptyFields === 0) {
        setWonGame();
        endGame();
    }
}

function endGame() {
    clearInterval(cancel);
    let boxes = document.querySelectorAll('.box');
    for (let i=0;i<boxes.length;i++) {
        if (boxes[i].classList.contains('revealed')) {
            continue;
        }
        let isMine = boxes[i].attributes.getNamedItem('mine').value;
        if (isMine === "true") {
            boxes[i].className = "box revealed";
            boxes[i].innerHTML = "💣";
        }
    }
    gameFinished = true;
}

function setLostGame() {
    indicatorDiv.innerHTML = "X";
    indicatorDiv.style.color = '#ff2e2e';
    indicatorDiv.style.visibility = 'visible';
}

function setWonGame() {
    indicatorDiv.innerHTML = "✔";
    indicatorDiv.style.color = '#1bcf4b';
    indicatorDiv.style.visibility = 'visible';
}

function revealBox(element) {
    let isMine = element.attributes.getNamedItem('mine').value;
    if (isMine === "true") {
        element.className = "box revealed";
        element.innerHTML = "💣";
        return true;
    }
    element.className = "box revealed";
    let surroundingMines = element.attributes.getNamedItem('surroundingMines').value;
    if (surroundingMines > 0) {
        element.innerHTML = surroundingMines;
    } else {
        let location = library.convertIdToLocation(element.id);
        if (location.x > 0) {
            checkAdjacentBoxes(document.getElementById(library.convertLocationToId(location.x - 1, location.y)));
        } else {
            checkAdjacentBoxes(document.getElementById(library.convertLocationToId(location.x + 1, location.y)));
        }
    }
}

function checkAdjacentBoxes(element) {
    if (element === null) {
        return;
    }
    if (element.attributes.getNamedItem('mine').value === "true") {
        return;
    }
    let surroundingMines = element.attributes.getNamedItem('surroundingMines').value;
    if (surroundingMines > 1) {
        return;
    }
    if (element.classList.contains('revealed')) {
        return;
    }

    element.className = "box revealed";
    if (surroundingMines === "1") {
        element.innerHTML = surroundingMines;
    }
    gameBoard.removeFromLeftEmptyFields();
    let location = library.convertIdToLocation(element.id);
    if (location.x > 0) {
        checkAdjacentBoxes(document.getElementById(library.convertLocationToId(location.x - 1, location.y)));
    }
    if (location.x < 30) {
        checkAdjacentBoxes(document.getElementById(library.convertLocationToId(location.x + 1, location.y)));
    }
    if (location.y > 0) {
        checkAdjacentBoxes(document.getElementById(library.convertLocationToId(location.x, location.y - 1)));
    }
    if (location.y < 30) {
        checkAdjacentBoxes(document.getElementById(library.convertLocationToId(location.x, location.y + 1)));
    }
}