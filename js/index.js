let body = document.querySelector('body');
let resetButton = document.getElementById('reset');
let gameZone = document.getElementById('board');
let result = document.getElementById('result');
let player1 = document.getElementById('player1');
let player2 = document.getElementById('player2');
let score = document.getElementById('score');
let holder = document.querySelectorAll('.holder');

const GAME_OPTIONS = ['scissors', 'paper', 'rock', 'lizard', 'spock'];
const GAME_OPTIONS_SIZE = GAME_OPTIONS.length;
const MESSAGES = {
    "winMessage": "You Win",
    "tieMessage": "Tie Game",
    "loseMessage": "You lose"
}
let gameStatus = {
    "player1": String,
    "player2": String,
    "winner": String,
    "message": String,
    "score": {
        "player1": 0,
        "player2": 0,
        "tie": 0
    }
}

const generateBoard = () => {
    startGame();
    bindResetButton();
    triggerOpenRulesEvents();
    triggerCloseModalEvents();
    triggerSelectedItemEvents();
}

const startGame = () => {
    score.innerText = 0;
    for (let a = 0; GAME_OPTIONS.length > a; a++) {
        gameZone.innerHTML += renderElements(GAME_OPTIONS[a]);
    }
}

const renderElements = (element) => {
    return '<button id="' + element + '" class="item ' + element + '"><span><img src = "./images/icon-' + element + '.svg" alt="scissor" ></span></button>'
}

const triggerOpenRulesEvents = () => {
    document.getElementById('rulesBtn').addEventListener('click', (e) => {
        body.classList.add('overlay');
    });
}

const triggerCloseModalEvents = () => {
    document.querySelectorAll('.close').forEach(bindTriggerOptionsEvent);
}

const bindTriggerOptionsEvent = (selected) => {
    selected.addEventListener('click', () => {
        body.classList.remove('overlay');
    });
}

const triggerSelectedItemEvents = () => {
    document.querySelectorAll('.item').forEach(bindAnimate);
}

const bindResetButton = () => {
    resetButton.addEventListener('click', () => {
        body.classList.remove('success');
        score.classList.remove('scale');
        resetButton.classList.remove('fadeIn');
        [player1, player2].forEach((element) => { element.classList.remove('waves') });
        holder.forEach((content) => {
            content.innerHTML = "";
        })
    });
}

const bindAnimate = (selected) => {
    selected.addEventListener('click', (e) => {
        result.innerHTML = "<h1>Please Wait...</h1>";
        gameStatus.player1 = e.target.getAttribute('id');
        animateSelected(gameStatus.player1, player1);
        setTimeout(() => {
            compare(GAME_OPTIONS.findIndex(getIndex));
            animateSelected(gameStatus.player2, player2);
        }, 2000);
    });
}

const checkIfLastIndex = (selectedIndex, computer) => {
    if ((selectedIndex + 1 === GAME_OPTIONS_SIZE && computer === 0)) {
        return 0
    }
    return selectedIndex > Math.floor(GAME_OPTIONS.length / 2) ? selectedIndex - 2 : selectedIndex + 2;
}

const updateResults = () => {
    setTimeout(() => {
        score.innerText = gameStatus.score.player1;
        score.classList.add('scale');
    }, 1000)
}

const animateSelected = (item, targetElement) => {
    let clonedSelected = document.getElementById(item).cloneNode(true);
    clonedSelected.classList.add('selected');
    targetElement.appendChild(clonedSelected);
    body.classList.add('success');
    setTimeout(() => {
        result.innerHTML = '<h1>' + gameStatus.message + '</h1>';
        resetButton.classList.add('fadeIn');
    }, 3500)
}

const getIndex = (indexOption) => {
    return indexOption === gameStatus.player1;
}

const getRandomArbitrary = () => {
    return Math.floor(Math.random() * (GAME_OPTIONS.length));
}

const compare = (selected) => {
    computer = getRandomArbitrary();
    gameStatus.player2 = GAME_OPTIONS[computer];

    let selectedIndex = checkIfLastIndex(selected, computer);

    switch (true) {
        case (selected + 1 === computer || selectedIndex === computer):
            player1.classList.add('waves');
            gameStatus = {
                ...gameStatus,
                "winner": 'player1',
                "message": MESSAGES.winMessage,
                'score': {
                    ...gameStatus.score, 'player1': (gameStatus.score.player1 + 1
                    )
                }
            };
            updateResults();
            break;
        case (computer === selected):
            gameStatus = {
                ...gameStatus,
                "winner": 'tie',
                "message": MESSAGES.tieMessage,
                'score': {
                    ...gameStatus.score,
                    'tie': (gameStatus.score.tie + 1)
                }
            };
            break;
        default:
            player2.classList.add('waves');
            gameStatus = {
                ...gameStatus,
                "winner": 'player2',
                "message": MESSAGES.loseMessage,
                'score': {
                    ...gameStatus.score,
                    'player2': (gameStatus.score.player2 + 1)
                }
            };
    }
}

window.onload = () => {
    generateBoard();
}