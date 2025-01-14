let mic;
let pitch;
let audience = {
  cheer: [],
  boo: [],
  laugh: [],
  aww: []
};
let isPlaying = false;
let speechStartTime = null;


function preload() {

  for (let i = 1; i<= NUMBEROFFILES; i++) {
  audience.cheer.push(loadSound('sounds/cheer${i}.mp3'));
  audience.boo.push(loadSound('sounds/boo${i}.mp3'));
  audience.laugh.push(loadSound('sounds/laugh${i}.mp3'));
  audience.aww.push(loadSound('sounds/aww${i}.mp3'));
}
}


function setup() {
  mic = new p5.AudioIn();
  mic.start();

  let audioContext = getAudioContext();
  pitch = ml5.pitchDetection('models/crepe', audioContext, mic.stream, modelLoaded);
}


function modelLoaded() {
  console.log("Pitch detection model loaded.");
  getPitch();
}


function getPitch(){
  pitch.getPitch((err, frequency) => {
    if (err) {
      console.error(err);
    } else if (frequency) {
      handleInput(frequency);
    }
    getPitch();
  });
}


function handleInput(frequency) {
  let micLevel = mic.getLevel();

  if (micLevel > 0.05) {
    if (speechStartTime === null) {
      speechStartTime = millis();
    }

    if (micLevel > 0.1) {
      if (frequency > 200){
        triggerResponse('cheer', millis() - speechStartTime);
      } else {
        triggerResponse('boo', millis() - speechStartTime);
      }
    } else {
      if (frequency < 200) {
        triggerResponse('aww', millis() - speechStartTime);
      }
    }
  } else {
    speechStartTime = null;
  }
}


function triggerResponse(type, duration) {
  if (!isPlaying && audience[type].length > 0) {
    isPlaying = true;

    let fileIndex;
    if (duration < 2000) {
      fileIndex = 0;
    } else if (duration < 4000) {
      fileIndex = 1;
    } else if (duration < 6000) {
      fileIndex = 2;
    } else if (duration < 8000) {
      fileIndex = 3;
    } else if (duration < 10000) {
      fileIndex = 4;
    } else { 
      fileIndex = 5;
    }

    let response = audience[type][fileIndex];
    response.play();

    response.onended(() => {
      isPlaying = false;
    });
  }
}