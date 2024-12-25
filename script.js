const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';
const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

const cellElements = document.querySelectorAll('[data-cell]');
const board = document.querySelector('.board');
const winningMessageElement = document.getElementById('winningMessage');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
const restartButton = document.getElementById('restartButton');
const playerXElement = document.getElementById('playerX');
const playerOElement = document.getElementById('playerO');
const gameModeButtons = document.querySelectorAll('.game-mode button');
const startPopup = document.getElementById('startPopup');
const selectedModeElement = document.getElementById('selectedMode');
const clickSound = document.getElementById('clickSound');
const winSound = document.getElementById('winSound');
const drawSound = document.getElementById('drawSound');
const bgm = document.getElementById('bgm');
bgm.volume = 1.0; // Set BGM volume to 60%
let circleTurn;
let singlePlayer = false;
let gameStarted = false;

restartButton.addEventListener('click', () => {
    gameStarted = false;
    document.querySelector('.game-mode').style.display = 'flex';
    selectedModeElement.style.display = 'none';
    winningMessageElement.classList.remove('show');
    startPopup.classList.add('show');
    setTimeout(() => {
        startPopup.classList.remove('show');
    }, 2000);
});

gameModeButtons.forEach(button => {
    button.addEventListener('click', () => {
        singlePlayer = button.id === 'singlePlayer';
        gameStarted = true;
        document.querySelector('.game-mode').style.display = 'none';
        selectedModeElement.style.display = 'block';
        selectedModeElement.innerText = `${singlePlayer ? 'Computer' : 'Two Players'} Mode`;
        startPopup.classList.add('show');
        bgm.play();
        setTimeout(() => {
            startPopup.classList.remove('show');
            startGame();
        }, 2000);
    });
});

function startGame() {
    if (!gameStarted) return;
    circleTurn = false;
    cellElements.forEach(cell => {
        cell.className = 'cell';
        cell.textContent = '';
        cell.style.pointerEvents = 'auto'; // Enable pointer events
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    winningMessageElement.classList.remove('show');
    updatePlayerIndicator();
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
    placeMark(cell, currentClass);
    clickSound.play();

    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        if (singlePlayer && circleTurn) {
            setTimeout(aiMove, 500);
        }
    }
}

function aiMove() {
    const availableCells = [...cellElements].filter(cell => !cell.classList.contains(X_CLASS) && !cell.classList.contains(CIRCLE_CLASS));
    if (availableCells.length === 0) return;
    
    const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    placeMark(randomCell, CIRCLE_CLASS);
    clickSound.play();
    if (checkWin(CIRCLE_CLASS)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
    }
}

function endGame(draw) {
    if (draw) {
        winningMessageTextElement.innerText = 'Draw!';
        drawSound.play();
    } else {
        winningMessageTextElement.innerText = `${circleTurn ? "Player O" : "Player X"} Wins!`;
        winSound.play();
    }
    winningMessageElement.classList.add('show');
    cellElements.forEach(cell => {
        cell.style.pointerEvents = 'none';
    });
    bgm.pause();
    bgm.currentTime = 0;
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS);
    });
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
    cell.textContent = currentClass === X_CLASS ? 'X' : 'O';
    cell.style.pointerEvents = 'none'; // Make filled squares unchangeable
}

function swapTurns() {
    circleTurn = !circleTurn;
    updatePlayerIndicator();
    cellElements.forEach(cell => {
        if (!cell.classList.contains(X_CLASS) && !cell.classList.contains(CIRCLE_CLASS)) {
            cell.style.pointerEvents = 'auto';
        } else {
            cell.style.pointerEvents = 'none';
        }
    });
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}

function updatePlayerIndicator() {
    const isXTurn = !circleTurn;
    playerXElement.classList.toggle('active', isXTurn);
    playerOElement.classList.toggle('active', !isXTurn);
    playerXElement.classList.toggle('x', isXTurn);
    playerOElement.classList.toggle('circle', !isXTurn);
    playerXElement.classList.toggle('hover', isXTurn);
    playerOElement.classList.toggle('hover', !isXTurn);
}
