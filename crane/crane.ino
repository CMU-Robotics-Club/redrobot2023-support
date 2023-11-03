// vim: tabstop=4 shiftwidth=4 expandtab
#include <Servo.h>
#include <Adafruit_NeoPixel.h>

#define NUM_LEDS 12
#define BRIGHTNESS 20

#define LEDS1_PIN 4
#define LEDS2_PIN 5
#define LEDS3_PIN 6
#define LEDS4_PIN 7

#define SERVO_PIN 12
#define SENSOR1_PIN 2
#define SENSOR2_PIN 3

Servo srv;

Adafruit_NeoPixel leds1(NUM_LEDS, LEDS1_PIN, NEO_GRB + NEO_KHZ800);
Adafruit_NeoPixel leds2(NUM_LEDS, LEDS2_PIN, NEO_GRB + NEO_KHZ800);
Adafruit_NeoPixel leds3(NUM_LEDS, LEDS3_PIN, NEO_GRB + NEO_KHZ800);
Adafruit_NeoPixel leds4(NUM_LEDS, LEDS4_PIN, NEO_GRB + NEO_KHZ800);

uint8_t cur = 0;
uint8_t tgt = 0;

void setup() {
    leds1.begin();
    leds1.show();
    leds1.setBrightness(BRIGHTNESS);

    leds2.begin();
    leds2.show();
    leds2.setBrightness(BRIGHTNESS);

    leds3.begin();
    leds3.show();
    leds3.setBrightness(BRIGHTNESS);

    leds4.begin();
    leds4.show();
    leds4.setBrightness(BRIGHTNESS);

    srv.attach(SERVO_PIN, 900, 2200);
    srv.write(cur);

    pinMode(SENSOR1_PIN, INPUT_PULLUP);
    pinMode(SENSOR2_PIN, INPUT_PULLUP);

    Serial.begin(115200);
}

void set_leds(Adafruit_NeoPixel *leds, uint8_t mode) {
    for (int i = 0; i < NUM_LEDS; i++) {
        if (mode == 0) leds->setPixelColor(i, leds->Color(0, 0, 0));
        if (mode == 1) {
            int x = (millis() / 300);
            x = x % 2;
            if (i % 2 == x) leds->setPixelColor(i, leds->Color(255, 0, 0));
            else            leds->setPixelColor(i, leds->Color(0, 0, 0));
        }
        if (mode == 2) {
            int x = (millis() / 300);
            x = x % 2;
            if (i % 2 == x) leds->setPixelColor(i, leds->Color(0, 0, 255));
            else            leds->setPixelColor(i, leds->Color(0, 0, 0));
        }
        if (mode == 3) {
            /*int x = (millis() / 300);
            x = x % 3;
            if (i % 3 == x) leds->setPixelColor(i, leds->Color(80, 80, 80));
            else            leds->setPixelColor(i, leds->Color(0, 0, 0));*/
            if (i % 2 == 0) leds->setPixelColor(i, leds->Color(80, 80, 80));
            else            leds->setPixelColor(i, leds->Color(0, 0, 0));
        }
    }
    leds->show();
}

void set_servo(uint8_t mode) {
    if (mode == 0) {
        tgt = 16 + (((int)(millis() / 100)) % 10);
    }
    if (mode == 1) tgt = 96;
    if (mode == 2) tgt = 176;
    if (mode == 3) tgt = 176;
}

void loop() {
    while (Serial.available()) {
        uint8_t x = Serial.read();
        set_leds(&leds1, ((x >> 0) & 0x3));
        set_leds(&leds2, ((x >> 0) & 0x3));
        set_leds(&leds3, ((x >> 2) & 0x3));
        set_leds(&leds4, ((x >> 2) & 0x3));
        set_servo((x >> 4) & 0x3);
    }

    uint8_t s1 = !digitalRead(SENSOR1_PIN);
    uint8_t s2 = !digitalRead(SENSOR2_PIN);
    Serial.write((s2 << 1) | (s1 << 0));

    //if (Serial.available()) tgt = Serial.read();

    for (int i = 0; i < 10; i++) {
        delay(10);
        if (tgt > cur) cur += 1;
        if (tgt < cur) cur -= 1;
        srv.write(cur);
    }
}

