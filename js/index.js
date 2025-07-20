// Scroll animation for sections
const aboutSections = document.querySelectorAll('.about-section');

function revealSections() {
  aboutSections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      section.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', revealSections);
window.addEventListener('load', revealSections);

// Elements
const muteBtn = document.getElementById('muteBtn');
const muteIcon = document.getElementById('muteIcon');

// Volume and mute settings
const volumeLevel = 0.5;
let isMuted = localStorage.getItem('ghost_isMuted') === 'true';

// Preload audio
const backgroundAudio = new Audio('sounds/background.mp3');
const button = new Audio('sounds/button.mp3');

backgroundAudio.loop = true;
backgroundAudio.volume = 0;
backgroundAudio.muted = isMuted;

// On page load
window.addEventListener('load', () => {
  // Set initial mute icon
  muteIcon.src = isMuted ? 'images/speaker-unmute.svg' : 'images/speaker-mute.svg';
  muteIcon.alt = isMuted ? 'Muted' : 'Speaker Icon';

  // Play button sound after navigation (if flagged)
  if (sessionStorage.getItem('playButtonSound') === 'true') {
    sessionStorage.removeItem('playButtonSound');
    buttonSound();
  }
});

// ⚠️ Wait for user interaction to play background audio
window.addEventListener('click', initAudioOnce, { once: true });

function initAudioOnce() {
  backgroundAudio.play().then(() => {
    if (!isMuted) {
      fadeInVolume(backgroundAudio, volumeLevel, 2000);
    }
  }).catch(err => {
    console.warn("Autoplay failed:", err);
  });
}

// Mute toggle
muteBtn.addEventListener('click', () => {
  buttonSound(); // play click sound

  isMuted = !isMuted;
  localStorage.setItem('ghost_isMuted', isMuted ? 'true' : 'false');

  if (isMuted) {
    backgroundAudio.muted = true;
    backgroundAudio.volume = 0;
  } else {
    backgroundAudio.muted = false;
    fadeInVolume(backgroundAudio, volumeLevel, 500); // quick fade back in
  }

  // Update icon
  muteIcon.src = isMuted ? 'images/speaker-unmute.svg' : 'images/speaker-mute.svg';
  muteIcon.alt = isMuted ? 'Muted' : 'Speaker Icon';
});

// Fade in audio volume
function fadeInVolume(audio, targetVolume, duration) {
  const steps = 30;
  const interval = duration / steps;
  const increment = targetVolume / steps;
  let currentStep = 0;

  const fade = setInterval(() => {
    if (isMuted || currentStep >= steps) {
      clearInterval(fade);
      audio.volume = isMuted ? 0 : targetVolume;
      return;
    }
    audio.volume = Math.min(audio.volume + increment, targetVolume);
    currentStep++;
  }, interval);
}

// Play button click sound
function buttonSound() {
  if (!isMuted) {
    button.currentTime = 0;
    button.play();
  }
}
