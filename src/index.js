import Settings from './settings/settings.js';
import allModeButtons from './buttons/buttons.js';

const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const continueButton = document.getElementById('continue-button');
const resetButton = document.getElementById('reset-button');

const boardContainer = document.getElementById('board-container');

const modeButtons = document.getElementById('mode-buttons');
const modeButtonsContainer = document.getElementById('mode-buttons-container');

const timerContainer = document.getElementById('timer-container');
const gameMessage = document.getElementById('game-message');

let settings;
let timerInterval;

// Card Flipping and Checking Logic
// =================================================================

function flipCard(e) {
  const isRunning = settings.getRunning();
  const locked = settings.getLocked();

  if (!isRunning || locked) return;

  const card = e.currentTarget;
  card.classList.add('rotate-y-[180deg]');

  const { row, column } = card.dataset;

  const firstCard = settings.getFirstCard();
  const secondCard = settings.getSecondCard();

  const allCards = settings.getCards();

  setTimeout(() => {
    card.innerHTML = allCards[row][column].body;
  }, 200);

  if (!firstCard) {
    settings.setFirstCard(card);
    return;
  }

  if (!secondCard) {
    settings.setSecondCard(card);
  }

  settings.setLocked(true);
  matchCards(settings.getFirstCard(), settings.getSecondCard(), allCards);
}

function matchCards(firstCard, secondCard, allCards) {
  if (firstCard === secondCard) {
    setTimeout(() => {
      settings.clearFirstAndSecondCards();
      settings.setLocked(false);
    }, 500);
    return;
  }

  const firstCardRow = +firstCard.dataset.row;
  const firstCardColumn = +firstCard.dataset.column;

  const secondCardRow = +secondCard.dataset.row;
  const secondCardColumn = +secondCard.dataset.column;

  if (
    allCards[firstCardRow][firstCardColumn].id ===
    allCards[secondCardRow][secondCardColumn].id
  ) {
    checkWin(firstCard, secondCard);
  } else {
    setTimeout(() => {
      settings.clearFirstAndSecondCards();
      settings.setLocked(false);
    }, 500);
  }
}

function checkWin(firstCard, secondCard) {
  settings.incrementCheckedCards();

  const { rows, columns } = settings.getSizes();
  const checkedCardsCount = settings.getCheckedCardsCount();

  if (checkedCardsCount === (rows * columns) / 2) {
    endGame('Win');
  } else {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    settings.setFirstCard(null);
    settings.setSecondCard(null);
    settings.setLocked(false);
  }
}

// Win and Lose
// =================================================================

function endGame(message) {
  let seconds = 0;
  showWin(message);

  const messageInterval = setInterval(() => {
    if (seconds === 4) {
      clearInterval(messageInterval);
      reset();
    } else if (seconds % 2) {
      gameMessage.classList.remove('text-white');
      gameMessage.classList.add('text-rose-900');
    } else {
      gameMessage.classList.remove('text-rose-900');
      gameMessage.classList.add('text-white');
    }
    seconds++;
  }, 1000);
}

// Timer
// =================================================================

function updateTimer() {
  const timer = settings.getTimer();
  const mins = Math.floor(timer / 60);
  const secs = timer - mins * 60;
  return `${mins > 0 ? `0${mins}` : '00'}:${secs < 10 ? `0${secs}` : `${secs}`}`;
}

// Draw Functions
// =================================================================

function drawBoard() {
  removeBoard();
  const { rows, columns } = settings.getSizes();

  const board = document.createElement('div');
  board.setAttribute('id', 'board');
  board.classList.add(
    'grid',
    'gap-2',
    `grid-cols-${columns}`,
    'p-5',
    'border',
    'border-cyan-900',
    'rounded-md',
  );

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const card = document.createElement('div');
      card.classList.add(
        'w-15',
        'h-15',
        'cursor-pointer',
        'bg-rose-800',
        'flex',
        'justify-center',
        'items-center',
        'text-white',
        'text-md',
        'rounded-md',
        'shadow-xl/40',
        'transition-all',
        'duration-400',
        '[transform-style:preserve-3d]',
      );

      card.setAttribute('data-row', `${i}`);
      card.setAttribute('data-column', `${j}`);
      card.addEventListener('click', flipCard);

      board.append(card);
    }
  }

  boardContainer.append(board);
  timerContainer.innerText = updateTimer();
}

function drawModeButtons() {
  allModeButtons.forEach((button) => {
    button.addClick(() => {
      settings = Settings.create(button.rows, button.columns);
      startButton.disabled = false;
    });

    modeButtonsContainer.append(button.getElement());
  });
}

function removeBoard() {
  const board = document.getElementById('board');
  if (board) {
    board.remove();
  }
}

// Reset
// =================================================================


function reset() {
  allModeButtons.forEach((button) => {
    const radioInput = button.getElement().children[0];
    radioInput.checked = false;
  });

  settings = null;

  stopButton.classList.add('hidden');
  continueButton.classList.add('hidden');

  startButton.classList.remove('hidden');
  startButton.disabled = true;

  resetButton.classList.add('hidden');
  resetButton.disabled = true;

  timerContainer.innerText = '';
  gameMessage.innerText = '';

  modeButtons.classList.remove('hidden');

  clearInterval(timerInterval);
  removeBoard();
}

function showWin(message) {
  gameMessage.innerText = `You ${message}!`;
  modeButtons.classList.add('hidden');
  stopButton.classList.add('hidden');
  resetButton.classList.add('hidden');
  timerContainer.innerText = '';
  clearTimeout(timerInterval);
  removeBoard();
}

// Start
// =================================================================

function start() {
  drawModeButtons();

  startButton.addEventListener('click', (e) => {
    e.currentTarget.classList.add('hidden');
    stopButton.classList.remove('hidden');
    settings.setRunning(true);
    modeButtons.classList.add('hidden');
    resetButton.classList.remove('hidden');
    drawBoard();

    timerInterval = setInterval(() => {
      settings.decrementTimer();
      timerContainer.innerText = updateTimer(settings.getTimer());
      if (!settings.getTimer()) {
        endGame('Lose');
      }
    }, 1000);
  });

  stopButton.addEventListener('click', (e) => {
    e.currentTarget.classList.add('hidden');
    continueButton.classList.remove('hidden');
    settings.setRunning(false);
    resetButton.disabled = false;
    clearInterval(timerInterval);
  });

  continueButton.addEventListener('click', (e) => {
    e.currentTarget.classList.add('hidden');
    stopButton.classList.remove('hidden');
    settings.setRunning(true);
    resetButton.disabled = true;

    timerInterval = setInterval(() => {
      settings.decrementTimer();
      timerContainer.innerText = updateTimer(settings.getTimer());
      if (!settings.getTimer()) {
        endGame('Lose');
      }
    }, 1000);
  });

  resetButton.addEventListener('click', reset);
}

// =================================================================

start();
