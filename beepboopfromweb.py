import serial
import sys
import time
import requests

ser = serial.Serial(sys.argv[1], 115200, timeout=0)

while True:
    t = requests.get("http://anish-mbp.wifi.local.cmu.edu:8080/state").json()["time"]

    if t == 0:
        ser.write(bytes([0b00000001]))
    elif t > 180:
        mod = t % 2
        ser.write(bytes([0b00000010 if mod else 0b00000000]))
    else:
        ser.write(bytes([0b00000100]))

    time.sleep(0.1)
