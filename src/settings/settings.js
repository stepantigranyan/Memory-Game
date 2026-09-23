import {ALL_CARDS} from '../consts/const.js';

function shuffleCards(cards) {
    return cards.sort(() => Math.random() - 0.5);
}

function getCards(rows, columns) {
    const shuffledCards = shuffleCards(ALL_CARDS);
    const halfCards = shuffledCards.slice(0, (rows * columns) / 2);
    const cards = [...halfCards, ...halfCards];
    const matrix = [];

    for (let i = 0; i < rows; i++) {
        const matrixRow = [];
        for (let j = 0; j < columns; j++) {
            matrixRow.push(cards[columns * i + j]);
        }
        matrix.push(matrixRow);
    }

    return matrix;
}

class Settings {
    #cards;
    #rows;
    #columns;
    #timer;
    #checkedCardsCount;

    constructor(rows, columns) {
        this.#cards = getCards(rows, columns);
        this.#rows = rows;
        this.#columns = columns;
        this.#timer = Math.floor(rows * columns * 4);

        this.firstCard = null;
        this.secondCard = null;

        this.locked = false;
        this.isRunning = false;

        this.#checkedCardsCount = 0;
    }

    static create(rows, columns) {
        return new Settings(rows, columns);
    }

    getCards() {
        return this.#cards;
    }

    getSizes() {
        return { rows: this.#rows, columns: this.#columns };
    }

    getTimer() {
        return this.#timer;
    }

    decrementTimer() {
        this.#timer--;
    }

    getCheckedCardsCount() {
        return this.#checkedCardsCount;
    }

    incrementCheckedCards() {
        this.#checkedCardsCount++;
    }

    getFirstCard() {
        return this.firstCard;
    }

    setFirstCard(value) {
        this.firstCard = value;
    }

    getSecondCard() {
        return this.secondCard;
    }

    setSecondCard(value) {
        this.secondCard = value;
    }

    clearFirstAndSecondCards() {
        this.firstCard.classList.remove('rotate-y-[180deg]');
        this.secondCard.classList.remove('rotate-y-[180deg]');
        this.firstCard.innerHTML = '';
        this.secondCard.innerHTML = '';
        this.firstCard = null;
        this.secondCard = null;
    }

    getLocked() {
        return this.locked;
    }

    setLocked(value) {
        this.locked = value;
    }

    getRunning() {
        return this.isRunning;
    }

    setRunning(value) {
        this.isRunning = value;
    }
}

export default Settings;
