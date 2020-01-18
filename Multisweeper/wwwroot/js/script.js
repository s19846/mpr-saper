var connection = new signalR.HubConnectionBuilder().withUrl("/multiplayerHub").build();

let library = new Library();

let gameDiv = document.getElementById("game");
let timerDiv = document.getElementById('timer');
let indicatorDiv = document.getElementById('indicator');
let gameFinished = false;
let seconds = 0;
let cancel = 0;
let counterDiv;
let gameBoard;

connection.on("ReceiveMessage", function (user, message) {
    console.log(user + message);
});

connection.on("ReceiveClick", function (x, y) {
    let targetBox = getTargetBox(x, y);
    clickBox(targetBox, true);
});

connection.on("CoronateTheSucker", function (user) {
    console.log("user");
    let div = document.createElement("div");
    let a = document.createElement("a");
    a.innerHTML = user
    div.appendChild(a);
    document.getElementById("player-list").appendChild(div);
});

connection.on("StartGame", function (serializedBoard) {
    let data = JSON.parse(serializedBoard);
    gameBoard = library.initGamefield(data);
    let startButton = document.getElementById("sendButton");
    startButton.style.visibility = "hidden";

    for (let i = 0; i < 30; i++) {
        let board = gameBoard.getBoard();
        let boardRow = board[i];
        let row = document.createElement("div");
        row.className = "row";
        row.id = "" + i;
        for (let j = 0; j < 30; j++) {
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

    counterDiv = document.getElementById('counter');
    counterDiv.innerHTML = gameBoard.leftEmptyFields;

    startGame();
});

connection.on("NewPlayerToList", function (name) {
    let li = document.createElement("li");
    li.textContent = name
    document.getElementById("player-list").appendChild(li);
});

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    connection.invoke("SendGame").catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

document.getElementById("setName").addEventListener("click", function (event) {
    let userInput = document.getElementById("userInput");
    connection.invoke("AddPlayer", userInput.value).catch(function (err) {
        return console.error(err.toString());
    });
    userInput.readOnly = true;
    let userButton = document.getElementById("setName");
    userButton.style.visibility = "hidden";
    event.preventDefault();
});

function incrementSeconds() {
    seconds += 1;
    timerDiv.innerText = seconds;
}

function startGame() {
    cancel = setInterval(incrementSeconds, 1000);
    gameDiv.style.visibility = "visible";
}

function getTargetBox(x, y) {
    let target = document.querySelector("[x='" + x + "'][y='" + y + "']");
    return target;
}

function clickEventBox(event) {
    clickBox(event.target);
}

function clickBox(element, socket = false) {
    if (gameFinished) {
        return false;
    }

    if (socket === false) {
        connection.invoke("SendClick", element.attributes.x.value, element.attributes.y.value);
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
    let user = document.getElementById("userInput").value;
    let score = document.getElementById("counter").innerHTML;

    connection.invoke("LostTheGame", user, score).catch(function (err) {
        return console.error(err.toString());
    });
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