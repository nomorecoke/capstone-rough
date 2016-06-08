#include <OneWire.h>
#include <DallasTemperature.h>
#include "Timer.h"
#include <Wire.h>
Timer t;
#include <SoftwareSerial.h>
SoftwareSerial mySerial(5, 6);
 
// Data wire is plugged into port 8 on the Arduino
#define ONE_WIRE_BUS 8
 
// Setup a oneWire instance to communicate with any OneWire devices (not just Maxim/Dallas temperature ICs)
OneWire oneWire(ONE_WIRE_BUS);
 
// Pass our oneWire reference to Dallas Temperature. 
DallasTemperature sensors(&oneWire);
 
#include <dht11.h>
dht11 DHT;
#define DHT11_PIN 13
 
int serial=0;
float value;
float humi;
float Co2;
float Tvoc;
 
void repeat() {
  mySerial.println("&value="+String(value)+"&humi="+String(humi)+"&serial="+String(serial++));
}
 
void setup(void)
{
  // start serial port
  Serial.begin(9600);
  Serial.println("Team - Rough");
  mySerial.begin(9600);
  // Start up the library
  sensors.begin();

  pinMode(4, OUTPUT);
  
  t.every(60000, repeat);
}
 
void loop(void)
{ 
  int chk;
  //long double vaa;
  
  sensors.requestTemperatures(); // Send the command to get temperatures
  value = sensors.getTempCByIndex(0);

  if(value > 25)
    digitalWrite(4, HIGH);
  else if(value < 24)
    digitalWrite(4, LOW);
    
  chk = DHT.read(DHT11_PIN);    // READ DATA
  humi = (float)DHT.humidity;

  Serial.println(value);
  
  //Serial.println(DHT.humidity,2);
 
//  Serial.println(analogRead(A4));
 
  delay(10);
  
  t.update();
  while(mySerial.available()) Serial.print((char)mySerial.read());
}
