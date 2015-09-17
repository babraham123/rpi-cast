#!/usr/bin/python

import smbus
import time
bus = smbus.SMBus(0)
address = 0xB0

def setup():
    data = [0x30, 0x01, 0x30, 0x08, 0x06, 0x90, 
            0x08, 0xC0, 0x1A, 0x40, 0x33, 0x33]
    for d in data:
        ack = bus.write_byte(address, d)
        time.sleep(0.01)
    time.sleep(0.1)

def translateBuffer(data_buf):
    points = []
    for i in [0,1,2,3]:
        Ix = data_buf[i*3 + 1];
        Iy = data_buf[i*3 + 2];
        s   = data_buf[i*3 + 3];
        Ix += (s & 0x30) <<4;
        Iy += (s & 0xC0) <<2;
        points.append((Ix, Iy))
    return points

def read():
    bus.write_byte(address, 0x36)
    time.sleep(0.01)
    # Request the 2 byte heading (MSB comes first)
    # ?
    data_buf = [0]*16
    d = read_byte_data(address, )

    while(Wire.available() and i < 16):
        data_buf[i] = Wire.receive()
        i += 1


if __name__ == "__main__":
    setup()
    while 1:
        data_buf = read()
        pts = translateBuffer(data_buf)
        time.sleep(0.1)


# 0 = /dev/i2c-0 (port I2C0), 1 = /dev/i2c-1 (port I2C1)
# long read_byte_data(int addr,char cmd)
# long write_byte_data(int addr,char cmd,char val)
# long write_byte(int addr,char val)

