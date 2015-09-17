// Wii Remote IR sensor  test sample code  by kako

#include <Wire.h>

int IRsensorAddress = 0xB0;
int slaveAddress;
int ledPin = 13;
boolean ledState = false;
byte data_buf[16];
int i;

int Ix1,Iy1,Ix2,Iy2;
int Ix3,Iy3,Ix4,Iy4;
int s;

void Write_2bytes(byte d1, byte d2)
{
    Wire.beginTransmission(slaveAddress);
    Wire.send(d1); Wire.send(d2);
    Wire.endTransmission();
}

void setup()
{
    slaveAddress = IRsensorAddress >> 1;   // This results in 0x21 as the address to pass to TWI
    Serial.begin(9600);
    pinMode(ledPin, OUTPUT);      // Set the LED pin as output
    Wire.begin();
    // IR sensor initialize
    Write_2bytes(0x30,0x01); delay(10);
    Write_2bytes(0x30,0x08); delay(10);
    Write_2bytes(0x06,0x90); delay(10);
    Write_2bytes(0x08,0xC0); delay(10);
    Write_2bytes(0x1A,0x40); delay(10);
    Write_2bytes(0x33,0x33); delay(10);
    delay(100);
}
void loop()
{
    ledState = !ledState;
    if (ledState) { digitalWrite(ledPin,HIGH); } else { digitalWrite(ledPin,LOW); }

    //IR sensor read
    Wire.beginTransmission(slaveAddress);
    Wire.send(0x36);
    Wire.endTransmission();

    Wire.requestFrom(slaveAddress, 16);        // Request the 2 byte heading (MSB comes first)
    for (i=0;i<16;i++) { data_buf[i]=0; }
    i=0;
    while(Wire.available() && i < 16) { 
        data_buf[i] = Wire.receive();
        i++;
    }

    Ix1 = data_buf[1];
    Iy1 = data_buf[2];
    s   = data_buf[3];
    Ix1 += (s & 0x30) <<4;
    Iy1 += (s & 0xC0) <<2;

    Ix2 = data_buf[4];
    Iy2 = data_buf[5];
    s   = data_buf[6];
    Ix2 += (s & 0x30) <<4;
    Iy2 += (s & 0xC0) <<2;

    Ix3 = data_buf[7];
    Iy3 = data_buf[8];
    s   = data_buf[9];
    Ix3 += (s & 0x30) <<4;
    Iy3 += (s & 0xC0) <<2;

    Ix4 = data_buf[10];
    Iy4 = data_buf[11];
    s   = data_buf[12];
    Ix4 += (s & 0x30) <<4;
    Iy4 += (s & 0xC0) <<2;

    Serial.print("   Ix1: "); Serial.print( int(Ix1) );
    Serial.print(" , Iy1: "); Serial.print( int(Iy1) );
    Serial.print("   Ix2: "); Serial.print( int(Ix2) );
    Serial.print(" , Iy2: "); Serial.print( int(Iy2) );
    Serial.println("");
    delay(100);
}
