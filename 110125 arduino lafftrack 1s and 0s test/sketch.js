var currentVolume = 0;
let mic;
let audience = {
  tiny: [],
  short: [],
  medium: [],
  long: []
};
let isPlaying = false;
let audienceValue = 0; // 1 if responding, 0 otherwise
let currentState = 0;
let speechStartTime = null;
let port;
let connectBtn;


function preload() {
  for (let i = 1; i <= 14; i++) {
    audience.tiny.push(loadSound(`sounds/tiny${i}.mp3`));
  }
  for (let i = 1; i <= 12; i++) {
    audience.short.push(loadSound(`sounds/short${i}.mp3`));
  }
  for (let i = 1; i <= 8; i++) {
    audience.medium.push(loadSound(`sounds/medium${i}.mp3`));
  }
  for (let i = 1; i <= 8; i++) {
    audience.long.push(loadSound(`sounds/long${i}.mp3`));
  }
}

function setup() {
  // Initialize serial communication
  port = createSerial();
  connectBtn = createButton('Connect to Arduino');
  connectBtn.position(20, 20);
  connectBtn.mousePressed(connectBtnClick);

  getAudioContext().suspend();
  mic = new p5.AudioIn();
  mic.start();
  getAudioContext().resume();
}

function draw() {
  if (isPlaying && currentState !== 1) {
    // Send '1' when laugh track starts and state hasn't been sent yet
    port.write('1\n');
    currentState = 1;
  } else if (!isPlaying && currentState !== 0) {
    // Send '0' when laugh track stops and state hasn't been sent yet
    port.write('0\n');
    currentState = 0;
  }

  // Update button label
  connectBtn.html(port.opened() ? 'Disconnect' : 'Connect to Arduino');

  console.log("Audience Value: ", audienceValue);

  // Analyze microphone input for speech detection
  let micLevel = mic.getLevel();
  let smoothing = 0.95;
  let smoothFactor = 1.0 - smoothing;
  currentVolume = smoothing * currentVolume + smoothFactor * micLevel;
  // console.log(currentVolume);

  if (currentVolume > 0.15) {
    if (speechStartTime === null) {
      speechStartTime = millis();
    }
  } else if (speechStartTime !== null) {
    let duration = millis() - speechStartTime;
    speechStartTime = null;

    triggerResponse(duration);
  }

  // Previous serial loop: continuously send the laughing state to Arduino
  // if (port.opened()) {
  //   port.write(audienceValue + '\n'); // Send 1 or 0
  // }
}

function connectBtnClick() {
  // Toggle connection to Arduino
  if (!port.opened()) {
    port.open('Arduino', 9600);
  } else {
    port.close();
  }
}

function triggerResponse(duration) {
  if (!isPlaying) {
    isPlaying = true;
    audienceValue = '1'; // Start audience response

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
      audienceValue = '0'; // Stop audience response
    });
  }
}