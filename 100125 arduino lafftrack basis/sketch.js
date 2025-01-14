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
let serial;

let port;              // Variable to hold serial port object
let connectBtn;        // Button to connect/disconnect from Arduino
let laughingValue = 0;    // Variable to store the brightness value to send
let slider;



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

  createCanvas(400, 400);
  background(220);

  port = createSerial();
  
  // slider = createSlider(0, 255);
  // slider.position(10, 10);
  // slider.size(80);

  // Creates a connect button for user to open/close the serial port connection
  connectBtn = createButton('Connect to Arduino');
  connectBtn.position(20, 360);
  connectBtn.mousePressed(connectBtnClick);


  // serial = new p5.SerialPort();
  // serial.open("COM3"); // replace with arduino port name
  // serial.on('open', () => console.log('Serial Port Opened'));

  getAudioContext().suspend();
  mic = new p5.AudioIn();
  mic.start();
  // mic.amp(1);
  // map (mic, 0, 1, 0, 100);
  getAudioContext().resume();
}



// function onSerialOpen() {
//   console.log('Serial Port Opened');
// }

// function onSerialData() {
//   console.log('Serial Data Received: ' + serial.readStringUntil('\n'));
// }

// function onSerialError(err) {
//   console.error('Serial Error: ', err);
// }




function draw() {
  background(150);

  let laughingValue = slider.value();

  // Map `mouseX` to a brightness value and display an ellipse with this brightness
  console.log(laughingValue);
  // fill(255, laughingValue);
  // ellipse(200, 200, 100);

  // Send brightness value to Arduino every 10 frames (to slow down data rate)
  if (frameCount % 10 == 0) {
    let laughingValueStr = String(laughingValue);    // Convert brightness to string
    port.write(laughingValue + '\n');          // Send brightness with newline
  }

  // Update button label based on connection status
  connectBtn.html(port.opened() ? 'Disconnect' : 'Connect to Arduino');

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

function connectBtnClick() {
  // Toggle connection to Arduino
  if (!port.opened()) {
    port.open('Arduino', 9600);               // Open serial port at 9600 baud
  } else {
    port.close();                              // Close serial port
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

    //sending duration to servo
    let playDuration = response.duration() * 1000; //millisecond conversion
    serial.write(`MOVE ${playDuration}\n`);

    response.onended(() => {
      isPlaying = false;
    });
  }
}