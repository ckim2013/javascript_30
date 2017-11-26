const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  .then(localMediaStream => {
    // console.dir(video);
    // console.log(window.URL.createObjectURL(localMediaStream));
    // console.log((localMediaStream));
    video.src = window.URL.createObjectURL(localMediaStream);
    video.play();
  })
  .catch(error => console.log(error));
}

function paintToCanvas() {
  // const width = video.videoWidth;
  // const height = video.videoHeight;
  // const { width, height } = video;

  const { videoWidth: width, videoHeight: height } = video;
  // console.log(width, height);
  [canvas.width, canvas.height] = [width, height];

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);

    // take the pixels out
    let pixels = ctx.getImageData(0, 0, width, height);

    // mess with them
    // redEffect(pixels);
    // pixels = rgbSplit(pixels);
    // ctx.globalAlpha = 0.1;

    // put them back
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100;  // red
    pixels.data[i + 1] = pixels.data[i + 1] - 50;   // green
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5;  // blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i - 150] = pixels.data[i + 0];  // red
    pixels.data[i + 500] = pixels.data[i + 1];   // green
    pixels.data[i - 550] = pixels.data[i + 2];  // blue
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (let i = 0; i < pixels.data.length; i = i + 4) {
    let red = pixels.data[i + 0];
    let green = pixels.data[i + 1];
    let blue = pixels.data[i + 2];
    let alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

function takePhoto() {
  // played the sound
  snap.currentTime = 0;
  snap.play();

  // take the data out of the canvas
  const data = canvas.toDataURL('image/url');
  // console.log(data);
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'handsome');
  // link.textContent = 'Download Image';
  link.innerHTML = `<img src="${data}" alt="Handsome man"/>`;
  strip.insertBefore(link, strip.firstChild);
}

getVideo();

// Once the video is played, it is going to emit an event paintToCanvas
// Calling paintToCanvas() does not work without this event listener
video.addEventListener('canplay', paintToCanvas);
