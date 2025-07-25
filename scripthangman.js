const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const hangmanImage = document.querySelector(".hangman-box img");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = gameModal.querySelector("button");
const customWordInput = document.querySelector(".custom-word");
const customHintInput = document.querySelector(".custom-hint");
const customGameBtn = document.querySelector(".start-custom-game");
const twoPlayerSetup = document.querySelector(".two-player-setup");
const container = document.querySelector(".container");
const stopGameBtn = document.querySelector(".stop-game");
const modeSelect = document.querySelector(".mode-select");
const soloModeBtn = document.querySelector(".solo-mode");
const twoPlayerModeBtn = document.querySelector(".two-player-mode");


// Initializing game variables
let currentWord, correctLetters, wrongGuessCount;
const maxGuesses = 6;

const resetGame = () => {
    // Ressetting game variables and UI elements
    correctLetters = [];
    wrongGuessCount = 0;
    hangmanImage.src = "hangman-0.svg";
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join("");
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    gameModal.classList.remove("show");
}

const getRandomWord = () => {
    // Selecting a random word and hint from the wordList
    const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = word; // Making currentWord as random word
    document.querySelector(".hint-text b").innerText = hint;
    resetGame();
}

const gameOver = (isVictory) => {
    // After game complete.. showing modal with relevant details
    const modalText = isVictory ? `You found the word:` : 'The correct word was:';
    gameModal.querySelector("img").src = `${isVictory ? 'victory' : 'lost'}.gif`;
    gameModal.querySelector("h4").innerText = isVictory ? 'Congrats!' : 'Game Over!';
    gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
    gameModal.classList.add("show");
}

const initGame = (button, clickedLetter) => {
    // Checking if clickedLetter is exist on the currentWord
    if(currentWord.includes(clickedLetter)) {
        // Showing all correct letters on the word display
        [...currentWord].forEach((letter, index) => {
            if(letter === clickedLetter) {
                correctLetters.push(letter);
                wordDisplay.querySelectorAll("li")[index].innerText = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        });
    } else {
        // If clicked letter doesn't exist then update the wrongGuessCount and hangman image
        wrongGuessCount++;
        hangmanImage.src = `hangman-${wrongGuessCount}.svg`;
    }
    button.disabled = true; // Disabling the clicked button so user can't click again
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

    // Calling gameOver function if any of these condition meets
    if(wrongGuessCount === maxGuesses) return gameOver(false);
    if(correctLetters.length === currentWord.length) return gameOver(true);
}

// Creating keyboard buttons and adding event listeners
for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i);
    keyboardDiv.appendChild(button);
    button.addEventListener("click", (e) => initGame(e.target, String.fromCharCode(i)));
}

container.style.display = "none";
twoPlayerSetup.style.display = "none";
modeSelect.style.display = "block";

playAgainBtn.addEventListener("click", getRandomWord);
const startCustomGame = () => {
    const word = customWordInput.value.trim().toLowerCase();
    const hint = customHintInput.value.trim();

    if (!/^[a-z]+$/.test(word)) {
        alert("Word must contain only lowercase letters (a-z).");
        return;
    }
    if (!hint) {
        alert("Please enter a hint.");
        return;
    }

    currentWord = word;
    document.querySelector(".hint-text b").innerText = hint;
    twoPlayerSetup.style.display = "none";
    container.style.display = "flex";
    resetGame();
};

customGameBtn.addEventListener("click", startCustomGame);
const startSoloMode = () => {
    modeSelect.style.display = "none";
    container.style.display = "flex";
    getRandomWord();
};

const chooseTwoPlayerMode = () => {
    modeSelect.style.display = "none";
    twoPlayerSetup.style.display = "block";
};

soloModeBtn.addEventListener("click", startSoloMode);
twoPlayerModeBtn.addEventListener("click", chooseTwoPlayerMode);
const stopGame = () => {
    container.style.display = "none";
    twoPlayerSetup.style.display = "none";
    modeSelect.style.display = "block";
    gameModal.classList.remove("show");
};
stopGameBtn.addEventListener("click", stopGame);
