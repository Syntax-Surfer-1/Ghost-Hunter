// Elements
  const bgOptions = document.getElementById('bgOptions');
  const ghostOptions = document.getElementById('ghostOptions');
  const muteBtn = document.getElementById('muteBtn');
  const muteIcon = document.getElementById('muteIcon');

  let selectedBG = parseInt(localStorage.getItem('selectedBG')) || 1;
  let selectedGhost = parseInt(localStorage.getItem('selectedGhost')) || 1;

  // Volume and mute settings
  const volumeLevel = 0.5;
  let isMuted = localStorage.getItem('ghost_isMuted') === 'true';

  // Remove background audio
  // const backgroundAudio = new Audio('sounds/background.mp3');
  const button = new Audio('sounds/button.mp3');
  // backgroundAudio.loop = true;
  // backgroundAudio.volume = 0;
  // backgroundAudio.muted = isMuted;

  // Load backgrounds
  for (let i = 1; i <= 4; i++) {
    const div = document.createElement('div');
    div.classList.add('option');
    if (i === selectedBG) div.classList.add('selected');
    div.innerHTML = `<img src="images/BG/${i}.jpg" alt="BG ${i}">`;
    div.onclick = () => {
      buttonSound();
      selectedBG = i;
      document.querySelectorAll('#bgOptions .option').forEach(opt => opt.classList.remove('selected'));
      div.classList.add('selected');
    };
    bgOptions.appendChild(div);
  }

  // Load ghost skins
  for (let i = 1; i <= 4; i++) {
    const div = document.createElement('div');
    div.classList.add('option');
    if (i === selectedGhost) div.classList.add('selected');
    div.innerHTML = `<img src="images/Ghost/${i}/G1.png" alt="Ghost Skin ${i}">`;
    div.onclick = () => {
      buttonSound();
      selectedGhost = i;
      document.querySelectorAll('#ghostOptions .option').forEach(opt => opt.classList.remove('selected'));
      div.classList.add('selected');
    };
    ghostOptions.appendChild(div);
  }

  // Cookie helper
  function setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 86400000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  function saveSelection() {
    localStorage.setItem('selectedBG', selectedBG);
    localStorage.setItem('selectedGhost', selectedGhost);

    setCookie('ghost_background', selectedBG, 1);
    setCookie('ghost_skin', selectedGhost, 1);

    sessionStorage.setItem('playButtonSound', 'true');
    window.location.href = "game.html";
  }

  // Mute logic
  window.addEventListener('load', () => {
    // backgroundAudio.play().then(() => {
    //   if (!isMuted) fadeInVolume(backgroundAudio, volumeLevel, 2000);
    // }).catch(err => console.warn("Autoplay failed:", err));

    muteIcon.src = isMuted ? 'images/speaker-unmute.svg' : 'images/speaker-mute.svg';
    muteIcon.alt = isMuted ? 'Muted' : 'Speaker Icon';

    if (sessionStorage.getItem('playButtonSound') === 'true') {
      sessionStorage.removeItem('playButtonSound');
      buttonSound();
    }
  });

  muteBtn.addEventListener('click', () => {
    buttonSound();
    isMuted = !isMuted;
    localStorage.setItem('ghost_isMuted', isMuted);
    // backgroundAudio.muted = isMuted;

    // if (!isMuted) {
    //   fadeInVolume(backgroundAudio, volumeLevel, 500);
    // } else {
    //   backgroundAudio.volume = 0;
    // }

    muteIcon.src = isMuted ? 'images/speaker-unmute.svg' : 'images/speaker-mute.svg';
    muteIcon.alt = isMuted ? 'Muted' : 'Speaker Icon';
  });

  function fadeInVolume(audio, targetVolume, duration) {
    // No longer needed since background audio is removed
  }

  function buttonSound() {
    if (!isMuted) {
      button.currentTime = 0;
      button.play();
    }
  }