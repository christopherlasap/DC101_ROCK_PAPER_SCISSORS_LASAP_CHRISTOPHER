/* ========================================
   Rock Paper Scissors - JavaScript Game Logic
   Author: Christopher Lasap
   Course: DC 101 - Web Development
   ======================================== */

// ========== GAME STATE VARIABLES ==========
let playerScore = 0;
let computerScore = 0;
let tieScore = 0;
let roundHistory = [];
let isAnimating = false;

// ========== DOM ELEMENTS ==========
const choiceButtons = document.querySelectorAll('.choice-btn');
const playerIcon = document.getElementById('playerIcon');
const computerIcon = document.getElementById('computerIcon');
const resultMessage = document.getElementById('resultMessage');
const playerScoreElement = document.getElementById('playerScore');
const computerScoreElement = document.getElementById('computerScore');
const tieScoreElement = document.getElementById('tieScore');
const resetBtn = document.getElementById('resetBtn');
const historySection = document.getElementById('historySection');
const historyList = document.getElementById('historyList');

// ========== CHOICE EMOJIS ==========
const choiceEmojis = {
    rock: '🪨',
    paper: '📄',
    scissors: '✂️'
};

// ========== INITIALIZE GAME ==========
/**
 * Sets up event listeners when the page loads
 */
function initGame() {
    // Add click event to each choice button
    choiceButtons.forEach(button => {
        button.addEventListener('click', handlePlayerChoice);
    });

    // Add click event to reset button
    resetBtn.addEventListener('click', resetGame);

    console.log('Game initialized successfully!');
}

// ========== HANDLE PLAYER CHOICE ==========
/**
 * Handles when player clicks a choice button
 * @param {Event} event - Click event from button
 */
function handlePlayerChoice(event) {
    // Prevent multiple clicks during animation
    if (isAnimating) return;

    // Get player's choice from button data attribute
    const playerChoice = event.currentTarget.dataset.choice;

    // Start the game round
    playRound(playerChoice);
}

// ========== PLAY ROUND ==========
/**
 * Main game logic for a single round
 * @param {string} playerChoice - Player's selected choice (rock, paper, or scissors)
 */
function playRound(playerChoice) {
    // Set animation flag
    isAnimating = true;

    // Disable all choice buttons during animation
    disableButtons(true);

    // Generate computer's random choice
    const computerChoice = getComputerChoice();

    // Show player's choice immediately
    displayChoice(playerIcon, playerChoice, true);

    // Animate computer thinking
    animateComputerThinking();

    // After 1 second, reveal computer choice and determine winner
    setTimeout(() => {
        displayChoice(computerIcon, computerChoice, true);

        // Determine the round winner
        const result = determineWinner(playerChoice, computerChoice);

        // Update scores based on result
        updateScore(result);

        // Display result message
        showResult(result, playerChoice, computerChoice);

        // Add round to history
        addToHistory(playerChoice, computerChoice, result);

        // Re-enable buttons after animation
        setTimeout(() => {
            isAnimating = false;
            disableButtons(false);
        }, 1500);
    }, 1000);
}

// ========== GET COMPUTER CHOICE ==========
/**
 * Generates a random choice for the computer
 * @returns {string} Computer's choice (rock, paper, or scissors)
 */
function getComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}

// ========== ANIMATE COMPUTER THINKING ==========
/**
 * Creates a thinking animation by cycling through choices
 */
function animateComputerThinking() {
    const choices = ['rock', 'paper', 'scissors'];
    let count = 0;

    const thinkingInterval = setInterval(() => {
        computerIcon.textContent = choiceEmojis[choices[count % 3]];
        computerIcon.classList.add('animate');
        setTimeout(() => computerIcon.classList.remove('animate'), 300);
        count++;
    }, 200);

    // Stop animation after 800ms
    setTimeout(() => clearInterval(thinkingInterval), 800);
}

// ========== DISPLAY CHOICE ==========
/**
 * Displays the choice icon with animation
 * @param {HTMLElement} element - DOM element to update
 * @param {string} choice - Choice to display
 * @param {boolean} animate - Whether to add animation class
 */
function displayChoice(element, choice, animate = false) {
    element.textContent = choiceEmojis[choice];
    
    if (animate) {
        element.classList.add('active', 'animate');
        setTimeout(() => element.classList.remove('animate'), 600);
    }
}

// ========== DETERMINE WINNER ==========
/**
 * Determines who wins the round based on game rules
 * @param {string} player - Player's choice
 * @param {string} computer - Computer's choice
 * @returns {string} Result: 'win', 'lose', or 'tie'
 */
function determineWinner(player, computer) {
    // Check for tie
    if (player === computer) {
        return 'tie';
    }

    // Check winning conditions for player
    const winConditions = {
        rock: 'scissors',     // Rock beats scissors
        paper: 'rock',        // Paper beats rock
        scissors: 'paper'     // Scissors beats paper
    };

    // Return win or lose based on game rules
    return winConditions[player] === computer ? 'win' : 'lose';
}

// ========== UPDATE SCORE ==========
/**
 * Updates the score counters based on round result
 * @param {string} result - Round result (win, lose, or tie)
 */
function updateScore(result) {
    if (result === 'win') {
        playerScore++;
        playerScoreElement.textContent = playerScore;
        animateScore(playerScoreElement);
    } else if (result === 'lose') {
        computerScore++;
        computerScoreElement.textContent = computerScore;
        animateScore(computerScoreElement);
    } else {
        tieScore++;
        tieScoreElement.textContent = tieScore;
        animateScore(tieScoreElement);
    }
}

// ========== ANIMATE SCORE ==========
/**
 * Adds a brief animation to score element
 * @param {HTMLElement} element - Score element to animate
 */
function animateScore(element) {
    element.style.transform = 'scale(1.3)';
    element.style.color = '#ff6b6b';
    
    setTimeout(() => {
        element.style.transform = 'scale(1)';
        element.style.color = '#667eea';
    }, 300);
}

// ========== SHOW RESULT ==========
/**
 * Displays the result message to the player
 * @param {string} result - Round result
 * @param {string} playerChoice - Player's choice
 * @param {string} computerChoice - Computer's choice
 */
function showResult(result, playerChoice, computerChoice) {
    let message = '';

    if (result === 'win') {
        message = `🎉 You Win! ${choiceEmojis[playerChoice]} beats ${choiceEmojis[computerChoice]}`;
    } else if (result === 'lose') {
        message = `💻 Computer Wins! ${choiceEmojis[computerChoice]} beats ${choiceEmojis[playerChoice]}`;
    } else {
        message = `🤝 It's a Tie! Both chose ${choiceEmojis[playerChoice]}`;
    }

    resultMessage.textContent = message;
    resultMessage.classList.add('show');
}

// ========== ADD TO HISTORY ==========
/**
 * Adds the round to the history list
 * @param {string} playerChoice - Player's choice
 * @param {string} computerChoice - Computer's choice
 * @param {string} result - Round result
 */
function addToHistory(playerChoice, computerChoice, result) {
    // Add new round to beginning of array
    roundHistory.unshift({
        player: playerChoice,
        computer: computerChoice,
        result: result
    });

    // Keep only last 5 rounds
    if (roundHistory.length > 5) {
        roundHistory.pop();
    }

    // Update history display
    updateHistoryDisplay();
}

// ========== UPDATE HISTORY DISPLAY ==========
/**
 * Updates the visual history list in the DOM
 */
function updateHistoryDisplay() {
    // Show history section if there are rounds
    if (roundHistory.length > 0) {
        historySection.classList.add('show');
    }

    // Clear current history
    historyList.innerHTML = '';

    // Create history items
    roundHistory.forEach((round, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';

        const roundInfo = document.createElement('div');
        roundInfo.className = 'round-info';
        roundInfo.innerHTML = `
            <span>${choiceEmojis[round.player]}</span>
            <span>vs</span>
            <span>${choiceEmojis[round.computer]}</span>
        `;

        const resultBadge = document.createElement('span');
        resultBadge.className = `result-badge ${round.result}`;
        resultBadge.textContent = round.result === 'win' ? 'WIN' : 
                                  round.result === 'lose' ? 'LOSE' : 'TIE';

        historyItem.appendChild(roundInfo);
        historyItem.appendChild(resultBadge);
        historyList.appendChild(historyItem);
    });
}

// ========== DISABLE/ENABLE BUTTONS ==========
/**
 * Toggles the disabled state of choice buttons
 * @param {boolean} disabled - Whether buttons should be disabled
 */
function disableButtons(disabled) {
    choiceButtons.forEach(button => {
        button.disabled = disabled;
    });
}

// ========== RESET GAME ==========
/**
 * Resets all game state to initial values
 */
function resetGame() {
    // Reset scores
    playerScore = 0;
    computerScore = 0;
    tieScore = 0;

    // Update score display
    playerScoreElement.textContent = '0';
    computerScoreElement.textContent = '0';
    tieScoreElement.textContent = '0';

    // Clear choice displays
    playerIcon.textContent = '?';
    computerIcon.textContent = '?';
    playerIcon.classList.remove('active');
    computerIcon.classList.remove('active');

    // Clear result message
    resultMessage.textContent = '';
    resultMessage.classList.remove('show');

    // Clear history
    roundHistory = [];
    historyList.innerHTML = '';
    historySection.classList.remove('show');

    // Reset animation flag
    isAnimating = false;
    disableButtons(false);

    console.log('Game reset successfully!');
}

// ========== START GAME ON PAGE LOAD ==========
// Initialize game when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initGame);