let score = 0, health = 3, timeLeft = 60;
    let ghostCount = 0;
    let gameInterval, ghostTimeout, currentGhost;
    let countdownOverlay, backgroundAudio, gunshotSound, hitSound, bonusSound, healthLossSound, gameOverSound, countdownSound;
    let playerName = '';
    let highScore = getCookie('ghost_high_score') || 0;

    const gameArea = document.getElementById('gameArea');
    const gameOverModal = document.getElementById('gameOverModal');
    const gameOverText = document.getElementById('gameOverText');
    const nameModal = document.getElementById('nameModal');
    const playerNameInput = document.getElementById('playerNameInput');

    // Preload sounds
    backgroundAudio = new Audio('/sounds/background.mp3');
    backgroundAudio.loop = true;
    gunshotSound = new Audio('/sounds/gunshot.mp3');
    hitSound = new Audio('/sounds/hit.wav');
    bonusSound = new Audio('/sounds/bonus.wav');
    healthLossSound = new Audio('sounds/health_loss.mp3');
    gameOverSound = new Audio('sounds/gameover.mp3');
    countdownSound = new Audio('sounds/123Go.mp3');

    // Countdown overlay element
    countdownOverlay = document.createElement('div');
    countdownOverlay.id = 'countdownOverlay';
    countdownOverlay.style.position = 'absolute';
    countdownOverlay.style.top = '50%';
    countdownOverlay.style.left = '50%';
    countdownOverlay.style.transform = 'translate(-50%, -50%)';
    countdownOverlay.style.fontSize = '6rem';
    countdownOverlay.style.color = '#fff';
    countdownOverlay.style.zIndex = '999';
    countdownOverlay.style.display = 'none';
    countdownOverlay.style.fontWeight = 'bold';
    countdownOverlay.style.textShadow = '2px 2px 4px black';
    gameArea.appendChild(countdownOverlay);

    // Add start button
    const startBtn = document.createElement('button');
    startBtn.id = 'startBtn';
    startBtn.textContent = 'Start Game';
    startBtn.style.position = 'absolute';
    startBtn.style.top = '50%';
    startBtn.style.left = '50%';
    startBtn.style.transform = 'translate(-50%, -50%)';
    startBtn.style.fontSize = '2rem';
    startBtn.style.padding = '1rem 2rem';
    startBtn.style.background = '#ff69b4';
    startBtn.style.border = 'none';
    startBtn.style.color = '#fff';
    startBtn.style.borderRadius = '10px';
    startBtn.style.cursor = 'pointer';
    startBtn.style.zIndex = '100';
    gameArea.appendChild(startBtn);

    startBtn.onclick = () => {
        startBtn.style.display = 'none'; 
        startCountdown();
    };

    function restart() {
        startBtn.style.display = 'none';
        gameOverModal.style.display = 'none';
        startCountdown();
    }

    function startCountdown() {
        let count = 3;
        startBtn.style.display = 'none'; 
        countdownOverlay.style.display = 'block';
        setTimeout(() => {
            countdownSound.play();
        }, 1000);

        const countdownInterval = setInterval(() => {
            if (count > 0) {
                countdownOverlay.textContent = count;
                count--;
            } else {
                countdownOverlay.textContent = 'GO!';
                clearInterval(countdownInterval);
                setTimeout(() => {
                    countdownOverlay.style.display = 'none';
                    startGamePlay();
                }, 1000);
            }
        }, 1000);
    }

    function startGame() {
        score = 0;
        health = 3;
        timeLeft = 60;
        ghostCount = 0;
        currentGhost = null;

        updateHearts();
        document.getElementById('score').textContent = score;
        document.getElementById('time').textContent = timeLeft;
        gameOverModal.style.display = 'none';
        gameArea.innerHTML = '';
        gameArea.appendChild(startBtn);
        gameArea.appendChild(countdownOverlay);
        startBtn.style.display = 'block'; 
    }

    function startGamePlay() {
        clearInterval(gameInterval);
        clearTimeout(ghostTimeout);

        score = 0;
        health = 3;
        timeLeft = 60;

        updateHearts();
        document.getElementById('score').textContent = score;
        document.getElementById('time').textContent = timeLeft;


        backgroundAudio.currentTime = 0;
        backgroundAudio.play();

        gameInterval = setInterval(gameLoop, 1000);
        spawnGhost();
    }

    function gameLoop() {
        timeLeft--;
        document.getElementById('time').textContent = timeLeft;
        if (timeLeft <= 0 || health <= 0) endGame();
    }

    function spawnGhost() {
        if (currentGhost && gameArea.contains(currentGhost)) {
            gameArea.removeChild(currentGhost);
        }

        ghostCount++;
        const ghost = document.createElement('div');
        ghost.className = 'ghost';
        if (ghostCount % 6 === 0) ghost.classList.add('bonus');

        const maxTop = gameArea.clientHeight - 60;
        const maxLeft = gameArea.clientWidth - 60;
        ghost.style.top = Math.random() * maxTop + 'px';
        ghost.style.left = Math.random() * maxLeft + 'px';

        ghost.onclick = function (e) {
            e.stopPropagation();
            gunshotSound.play();
            const isBonus = ghost.classList.contains('bonus');
            score += isBonus ? 30 : 10;
            isBonus ? bonusSound.play() : hitSound.play();
            document.getElementById('score').textContent = score;
            gameArea.removeChild(ghost);
            currentGhost = null;
            if (timeLeft > 0 && health > 0) spawnGhost();
        };

        gameArea.appendChild(ghost);
        currentGhost = ghost;

        ghostTimeout = setTimeout(() => {
            if (gameArea.contains(ghost)) {
                gameArea.removeChild(ghost);
                health--;
                healthLossSound.play();
                updateHearts();
                if (health <= 0) endGame();
                else spawnGhost();
            }
        }, 1200);
    }

    function endGame() {
        clearInterval(gameInterval);
        clearTimeout(ghostTimeout);
        if (currentGhost && gameArea.contains(currentGhost)) {
            gameArea.removeChild(currentGhost);
        }
        currentGhost = null;
        backgroundAudio.pause();
        gameOverSound.play();

        if (score > highScore) {
            highScore = score;
            setCookie('ghost_high_score', highScore, 30);
        }

        gameOverText.innerHTML = `
            <p>Your Score: ${score}</p>
            <p>High Score: ${highScore}</p>
        `;
        gameOverModal.style.display = 'flex';
        startBtn.style.display = 'block';
    }

    function closeGameOverModal() {
        gameOverModal.style.display = 'none';
        resetGame();
    }

    function toggleModal(id) {
        const modal = document.getElementById(id);
        modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
    }

    function updateHearts() {
        if (health === 3) {
            imgSrc = 'https://i.ibb.co/hRQPthYR/heart-3.png';
        } else if (health === 2) {
            imgSrc = 'https://i.ibb.co/LD8W985Q/heart-2.png';
        } else if (health === 1) {
            imgSrc = 'https://i.ibb.co/2Y83TVhp/heart-1.png';
        } else {
            imgSrc = 'https://i.ibb.co/KzSxdvsb/heart-0.png';
        }   
        document.getElementById('hearts').src = imgSrc;
    }

    gameArea.onclick = function (e) {
        if (e.target.classList.contains('ghost')) return;
        gunshotSound.play();
        health--;
        healthLossSound.play();
        updateHearts();
        if (health <= 0) endGame();
    };

    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) === 0) {
                return c.substring(nameEQ.length, c.length);
            }
        }
        return null;
    }


    function resetGame() {
        score = 0;
        health = 3;
        timeLeft = 60;
        ghostCount = 0;
        currentGhost = null;

        addEventListener();
        updateHearts();
        document.getElementById('score').textContent = score;
        document.getElementById('time').textContent = timeLeft;
        gameOverModal.style.display = 'none';
        gameArea.innerHTML = '';
        gameArea.appendChild(startBtn);
        gameArea.appendChild(countdownOverlay);
        startBtn.style.display = 'block';
        playerNameInput.value = '';
        playerName = '';
        setCookie('ghost_player_name', '', 30);
        clearInterval(gameInterval);
        clearTimeout(ghostTimeout);
        backgroundAudio.pause();
        startBtn.style.display = 'block';
        startGame();
    }
    const customCursor = document.createElement('img');
        customCursor.src = 'https://i.ibb.co/23Dc5XbQ/Pointer.png';
        customCursor.id = 'customCursor';
        customCursor.style.position = 'absolute';
        customCursor.style.width = '80px'; 
        customCursor.style.height = '80px';
        customCursor.style.pointerEvents = 'none';
        customCursor.style.zIndex = '9999';
        customCursor.style.transform = 'translate(-50%, -50%)';
        gameArea.appendChild(customCursor);

// Move cursor with mouse inside gameArea
        gameArea.addEventListener('mousemove', function (e) {
            const rect = gameArea.getBoundingClientRect();
            customCursor.style.left = (e.clientX - rect.left) + 'px';
            customCursor.style.top = (e.clientY - rect.top) + 'px';
        });

        

