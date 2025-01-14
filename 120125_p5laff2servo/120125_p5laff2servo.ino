#include <Servo.h>

Servo myServo;
char lastState = '0';

void setup() {
  myServo.attach(9); // Servo connected to pin 9
  myServo.write(135); // Closed mouth position
  Serial.begin(9600); // Serial information, my one true love
}

void loop() {

  if (Serial.available()) {
    char audienceState = Serial.read(); // Read the incoming 1/0

    if (audienceState == '1' || audienceState == '0') {
      lastState = audienceState;
    Serial.print("Last State: ");
    Serial.println(lastState);
    }
  }

    if (lastState == '1') {
      moveServo();
    } else if (lastState == '0') {
      myServo.write(135); // Return to closed mouth
    }
  }




void moveServo() {
  myServo.write(45); // Move to 45 degrees
  delay(200);        // Wait for 200ms
  myServo.write(135); // Move to 135 degrees
  delay(200);        // Wait for 200ms
  }
  