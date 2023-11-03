import serial
import sys
import time

ser = serial.Serial(sys.argv[1], 115200, timeout=0)

OFF = 0
RED = 1
BLUE = 2
WHITE = 3

LEFT = 2
MID = 1
RIGHT = 0

names = {LEFT: "Red Team", RIGHT: "Blue Team", MID: "Balanced"}


def write_state(left_clr, right_clr, servo):
    return (right_clr << 0) | (left_clr << 2) | (servo << 4)

while True:
    time.sleep(0.02)

    state = ser.read(100)
    if len(state):
        state = state[-1]
    else:
        continue

    left = (state == 0x01)
    right = (state == 0x02)

    di = MID
    lc = WHITE
    rc = WHITE
    if left:
        lc = RED
        rc = OFF
        di = LEFT

    if right:
        lc = OFF
        rc = BLUE
        di = RIGHT

    st = write_state(lc, rc, di)
    print(hex(st))
    ser.write(bytearray([st]))

    print(f"STATE = {names.get(di, 'ERROR')}")
