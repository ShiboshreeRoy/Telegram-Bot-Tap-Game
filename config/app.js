// Variables
let score = 0;
let timeLeft = 10;
let premiumActive = false;
let gamePaused = false;
let timerInterval;
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("high-score");
const tapButton = document.getElementById("tap-btn");
const premiumButton = document.getElementById("premium-btn");
const pauseButton = document.getElementById("pause-btn");
const resetButton = document.getElementById("reset-btn");
const timerElement = document.getElementById("timer");
const progressBar = document.getElementById("progress-bar-inner");
const modeSwitch = document.getElementById("mode-switch");
const modeIcon = modeSwitch.querySelector('i');

// Retrieve high score from localStorage (if any)
const storedHighScore = localStorage.getItem("highScore");
if (storedHighScore) {
    highScoreElement.textContent = storedHighScore;
}

// Tap Button: Increase score
tapButton.addEventListener("click", () => {
    if (!gamePaused && timeLeft > 0) {
        score += premiumActive ? 2 : 1;
        scoreElement.textContent = score;
        playSound("tap");
    }
});

// Premium Button: Activate premium features
premiumButton.addEventListener("click", () => {
    if (!premiumActive) {
        premiumActive = true;
        premiumButton.disabled = true;
        premiumButton.textContent = "Premium Activated!";
        timeLeft += 5;  // Add 5 seconds of bonus time
        updateTimerDisplay();
        playSound("premium");
    }
});

// Pause Button: Pause/Resume the game
pauseButton.addEventListener("click", () => {
    if (gamePaused) {
        gamePaused = false;
        pauseButton.textContent = "Pause";
        startTimer();
    } else {
        gamePaused = true;
        pauseButton.textContent = "Resume";
        clearInterval(timerInterval);
    }
});

// Reset Button: Reset the game
resetButton.addEventListener("click", () => {
    score = 0;
    timeLeft = 10;
    premiumActive = false;
    gamePaused = false;
    scoreElement.textContent = score;
    updateTimerDisplay();
    premiumButton.disabled = false;
    premiumButton.textContent = "Go Premium";
    pauseButton.textContent = "Pause";
    clearInterval(timerInterval);
    startTimer();
});

// Timer Countdown
function startTimer() {
    timerInterval = setInterval(() => {
        if (!gamePaused) {
            timeLeft--;
            updateTimerDisplay();
            updateProgressBar();
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                tapButton.disabled = true;
                tapButton.textContent = "Game Over!";
                updateHighScore();
                playSound("gameOver");
                alert(`Game Over! Your Score: ${score}`);
            }
        }
    }, 1000);
}

// Update Timer Display
function updateTimerDisplay() {
    timerElement.textContent = `Time: ${timeLeft}`;
    if (timeLeft <= 5) {
        timerElement.style.color = "#ff5252";
    }
}

// Update Progress Bar
function updateProgressBar() {
    const progress = (timeLeft / 10) * 100;
    progressBar.style.width = `${progress}%`;
}

// Update High Score if necessary
function updateHighScore() {
    const currentHighScore = parseInt(localStorage.getItem("highScore") || "0");
    if (score > currentHighScore) {
        localStorage.setItem("highScore", score);
        highScoreElement.textContent = score;
    }
}

// Play sound effects for different actions
function playSound(action) {
    let audio;
    switch (action) {
        case "tap":
            audio = new Audio('https://www.soundjay.com/button/beep-07.wav');
            break;
        case "premium":
            audio = new Audio('https://www.soundjay.com/button/beep-05.wav');
            break;
        case "gameOver":
            audio = new Audio('https://www.soundjay.com/button/beep-06.wav');
            break;
    }
    audio.play();
}

// Toggle Dark/Light Mode
modeSwitch.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
        modeIcon.className = "fas fa-sun";
    } else {
        modeIcon.className = "fas fa-moon";
    }
});

// Initialize timer when the page loads
startTimer();
