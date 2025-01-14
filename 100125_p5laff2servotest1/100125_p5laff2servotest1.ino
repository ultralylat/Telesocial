#include <Servo.h>
Servo mouthServo; // creating servo object
bool isMoving = false; // track whether the servo is currently moving
unsigned long moveStartTime = 0; // storing in milliseconds when the servo started moving
unsigned long moveDuration = 0; // storing how long it should move, based on the MOVE command

void setup() {
  mouthServo.attach(9); // connect servo to pin 9, servo control signal wire (orange)
  mouthServo.write(90); // initial position (neutral ninety degrees)
  Serial.begin(9600); // you love it
}

void loop() {

  if (Serial.available()) {
    String command = Serial.readStringUntil('\n');
    Serial.println("Received: " + command); // Echo back to p5.js
  }


  if (Serial.available()) { // checking if data is incoming from serial port
    String command = Serial.readStringUntil('\n'); // reads command string sent from computer (MOVE xyz), reads until a newline character \n
    if (command.startsWith("MOVE")) { // checking if command starts with "MOVE" - only valid commands processed therein
    moveDuration = command.substring(5).toInt(); // extracts the value after "MOVE", which is the duration, converted to an integer
    moveStartTime = millis(); // records the time in milliseconds since the arduino started, to calculate how long the servo has been moving
    isMoving = true; // sets isMoving to true, indicating the servo should start moving
  }
}

if (isMoving) { // checks if the servo is moving. if true, servo motion logic is executed
  unsigned long elapsed = millis() - moveStartTime; // calculates the elapsed time since servo started moving
  if (elapsed < moveDuration) { // if the elapsed time is less than the duration, servo keeps moving
    
    int angle = (elapsed / 500) % 2 == 0 ? 45 : 135; // moving the servo between 45 and 135 degrees every 500ms
    //((elapsed / 500) divides elapsed into 500ms chunks, % 2 == 0 alternates between 0 and 1/even and odd, 45 : 135 sets angle based on even or odd value)
    
    mouthServo.write(angle); // sends above-calculated angle to servo

  } else { // if the elapsed time is greater than or equal to moveDuration
    isMoving = false;
    mouthServo.write(90); // return to neutral ninety degree position
  }
}
}