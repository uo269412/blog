const audioContainer = document.getElementById('audio-container');
const playBtn = document.getElementById('play');

const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const cover = document.getElementById('cover');

const miAudio = document.getElementById("audio");

miAudio.addEventListener("loadedmetadata", function() {
  var duracionMax = document.getElementById("audioMax");
  var minutos = Math.floor(miAudio.duration / 60).toString().padStart(2, "0");
  var segundos = Math.round(miAudio.duration % 60).toString().padStart(2, "0");
  duracionMax.textContent = minutos + ":" + segundos ;
});


function loadFile(){
  audio.src = "multimedia/audio.mp3";
  cover.src = "multimedia/podcast.png";
  title.innerText = "Podcast de IA";
}

loadFile();


function playFile(){
  audioContainer.classList.add('play');
  playBtn.querySelector('i.fas').classList.remove('fa-play');
  playBtn.querySelector('i.fas').classList.add('fa-pause');
  
  audio.play();
}

function pauseFile(){
  audioContainer.classList.remove('play');
  playBtn.querySelector('i.fas').classList.add('fa-play');
  playBtn.querySelector('i.fas').classList.remove('fa-pause');

  audio.pause();
}


function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
}

playBtn.addEventListener('click', () => {
  (audioContainer.classList.contains('play')) 
    ? pauseFile() : playFile();
});

function updateProgress(e) {
  const { duration, currentTime } = e.target;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
}

function setProgress(e){
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
}


audio.addEventListener('timeupdate', updateProgress);

progressContainer.addEventListener('click', setProgress);


