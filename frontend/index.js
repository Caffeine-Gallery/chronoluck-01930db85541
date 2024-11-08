import { backend } from "declarations/backend";

let currentGameId = null;
let timerInterval = null;

const mysteryBox = document.getElementById('mysteryBox');
const startButton = document.getElementById('startButton');
const timerElement = document.getElementById('timer');
const rewardElement = document.getElementById('reward');
const loadingSpinner = document.getElementById('loadingSpinner');

startButton.addEventListener('click', startGame);

async function startGame() {
    try {
        // Reset UI
        startButton.disabled = true;
        loadingSpinner.style.display = 'block';
        rewardElement.innerHTML = '';
        mysteryBox.classList.remove('opened');
        
        // Start new game
        currentGameId = await backend.startGame();
        
        // Start timer countdown
        startTimer();
        
        // Poll for game completion
        pollGameStatus();
    } catch (error) {
        console.error('Error starting game:', error);
        startButton.disabled = false;
        loadingSpinner.style.display = 'none';
    }
}

function startTimer() {
    let timeLeft = 30;
    timerElement.textContent = timeLeft + 's';
    
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft + 's';
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
        }
    }, 1000);
}

async function pollGameStatus() {
    try {
        const gameStatus = await backend.getGameStatus(currentGameId);
        
        if (gameStatus && gameStatus.isComplete) {
            // Game is complete, show reward
            mysteryBox.classList.add('opened');
            loadingSpinner.style.display = 'none';
            startButton.disabled = false;
            
            if (gameStatus.reward) {
                showReward(gameStatus.reward);
            }
            
            clearInterval(timerInterval);
            return;
        }
        
        // Continue polling
        setTimeout(pollGameStatus, 1000);
    } catch (error) {
        console.error('Error polling game status:', error);
        loadingSpinner.style.display = 'none';
        startButton.disabled = false;
    }
}

function showReward(reward) {
    rewardElement.innerHTML = `
        <div class="reward-animation">
            <h2>Congratulations!</h2>
            <p class="reward-text">${reward}</p>
        </div>
    `;
}
