#include <Servo.h>

Servo myServo;
bool isMoving = false;

void setup() {
  myServo.attach(9); // Servo connected to pin 9
  myServo.write(90); // Neutral position
  Serial.begin(9600); // Begin serial communication
}

void loop() {

  if (Serial.available()) {
    char audienceState = Serial.read(); // Read the incoming character

    Serial.print("Received Audience Value: ");
    Serial.println(audienceState);

    if (audienceState == '1' && !isMoving) {
      isMoving = true;
      moveServo();
      isMoving = false;
    } else if (audienceState == '0') {
      myServo.write(90); // Return to neutral
    }
  }
}


void moveServo() {
  myServo.write(45); // Move to 45 degrees
  delay(200);        // Wait for 200ms
  myServo.write(135); // Move to 135 degrees
  delay(200);        // Wait for 200ms
  myServo.write(90); // Return to neutral
}
