var currentVolume = 0;
let mic;
let amp;
let audience = {
  tiny: [],
  short: [],
  medium: [],
  long: []
};
let isPlaying = false;
let speechStartTime = null;



function preload() {

  for (let i = 1; i<= 14; i++) {
    audience.tiny.push(loadSound(`sounds/tiny${i}.mp3`));
  }

  for (let i = 1; i<= 12; i++) {
    audience.short.push(loadSound(`sounds/short${i}.mp3`));
    }

  for (let i = 1; i<= 8; i++) {
    audience.medium.push(loadSound(`sounds/medium${i}.mp3`));
    }

  for (let i = 1; i<= 8; i++) {
    audience.long.push(loadSound(`sounds/long${i}.mp3`));
    }
}



function setup() {
  getAudioContext().suspend();
  mic = new p5.AudioIn();
  mic.start();
  // mic.amp(1);
  // map (mic, 0, 1, 0, 100);
  getAudioContext().resume();
}




function draw() {
  let micLevel = mic.getLevel();
  let smoothing = 0.95;
  let smoothFactor = 1.0-smoothing;
  currentVolume = (smoothing * currentVolume) + (smoothFactor * micLevel);
  console.log(currentVolume);

  if (currentVolume > 0.05) {
    if (speechStartTime === null) {
      speechStartTime = millis();
    }
  } else if (speechStartTime !== null) {
    let duration = millis() - speechStartTime;
    speechStartTime = null;

    triggerResponse(duration);
  }
}




function triggerResponse(duration) {
  if (!isPlaying) {
    isPlaying = true;

    let audienceEmotion;
    if (duration < 2000) {
      audienceEmotion = 'tiny';
    } else if (duration < 3000) {
      audienceEmotion = 'short';
    } else if (duration < 5000) {
      audienceEmotion = 'medium';
    } else {
      audienceEmotion = 'long';
    }

    let response = random(audience[audienceEmotion]);
    response.play();

    response.onended(() => {
      isPlaying = false;
    });
  }
}