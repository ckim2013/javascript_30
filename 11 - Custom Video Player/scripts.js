// Get our elements
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');

const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelector('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

// Build out functions
function togglePlay() {
  // const method = video.paused? 'play' : 'pause'
  // video[method]();
  // or
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

window.togglePlay = togglePlay;

// Hook up the event listeners
video.addEventListener('click', togglePlay);
