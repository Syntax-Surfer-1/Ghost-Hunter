let score = 0;
let health = 3;
let timeLeft = 60;
let kills = 0;
let gameInterval;
let ghostTimeout;
let backgroundAudio, gunshotSound, hitSound, bonusSound, healthLossSound, gameOverSound;

function loadSounds() {
  backgroundAudio = new Audio('sounds/background.mp3');
  gunshotSound = new Audio('sounds/gunshot.mp3');
  hitSound = new Audio('sounds/hit.mp3');
  bonusSound = new Audio('sounds/bonus.mp3');
  healthLossSound = new Audio('sounds/health_loss.mp3');
  gameOverSound = new Audio('sounds/gameover.mp3');
  backgroundAudio.loop = true;
}

function startGame() {
  score = 0;
  kills = 0;
  health = 3;
  timeLeft = 60;

  document.getElementById('score').textContent = score;
  document.getElementById('health').textContent = health;
  document.getElementById('timer').textContent = timeLeft;

  clearInterval(gameInterval);
  clearTimeout(ghostTimeout);

  backgroundAudio.play();
  gameInterval = setInterval(gameLoop, 1000);
  spawnGhost();
}

function gameLoop() {
  timeLeft--;
  document.getElementById('timer').textContent = timeLeft;

  if (timeLeft <= 0 || health <= 0) {
    endGame();
  }
}

function spawnGhost() {
  const gameArea = document.getElementById('game-container');
  const ghost = document.createElement('img');
  kills++;

  const isBonus = kills % 6 === 0;
  ghost.src = isBonus ? 'images/G2.png' : 'images/G1.png';
  ghost.className = 'ghost';
  ghost.style.top = Math.random() * (gameArea.offsetHeight - 100) + 'px';
  ghost.style.left = Math.random() * (gameArea.offsetWidth - 60) + 'px';

  ghost.onclick = function () {
    gunshotSound.play();

    if (isBonus) {
      score += 30;
      bonusSound.play();
    } else {
      score += 10;
      hitSound.play();
    }

    document.getElementById('score').textContent = score;
    if (gameArea.contains(ghost)) {
      gameArea.removeChild(ghost);
    }
    spawnGhost();
  };

  gameArea.appendChild(ghost);

  ghostTimeout = setTimeout(() => {
    if (gameArea.contains(ghost)) {
      gameArea.removeChild(ghost);
      health--;
      healthLossSound.play();
      document.getElementById('health').textContent = health;

      if (health > 0) {
        spawnGhost();
      } else {
        endGame();
      }
    }
  }, 1500);
}

function endGame() {
  clearInterval(gameInterval);
  clearTimeout(ghostTimeout);
  backgroundAudio.pause();
  gameOverSound.play();

  document.getElementById('final-score').textContent = score;
  document.getElementById('submit-modal').classList.add('visible');
}

function saveScore(name, score) {
  const scores = JSON.parse(localStorage.getItem('ghost_scores') || '[]');
  scores.push({ name, score });
  scores.sort((a, b) => b.score - a.score);
  localStorage.setItem('ghost_scores', JSON.stringify(scores.slice(0, 5)));
}

function renderLeaderboard(id = 'leaderboard-list') {
  const scores = JSON.parse(localStorage.getItem('ghost_scores') || '[]');
  const board = document.getElementById(id);
  if (!board) return;
  board.innerHTML = '';
  scores.forEach((entry, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>#${i + 1} ${entry.name}</span><span>${entry.score}</span>`;
    board.appendChild(li);
  });
}

document.getElementById('submit-score').addEventListener('click', () => {
  const nameInput = document.getElementById('player-name');
  const name = nameInput.value.trim();
  if (name) {
    saveScore(name, score);
    nameInput.value = '';
    document.getElementById('submit-modal').classList.remove('visible');
    renderLeaderboard(); // You can also navigate to leaderboard page or update leaderboard here
    startGame(); // Restart game after submitting score if you want
  }
});

window.onload = () => {
  loadSounds();
  renderLeaderboard(); // If leaderboard list exists
  startGame();
};
