from flask import Flask, render_template, request, make_response, session, redirect
import threading
import logging
import time, os
from datetime import datetime
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

CRANE_MULT = 3

app = Flask(__name__,
            static_url_path="/res",
            static_folder="res",
            template_folder="")

@app.route("/", methods=["GET"])
def homepage():
    return render_template("index.html")

def bg_th_1():
    global red_crane, blue_crane
    last_n = 0
    while True:


        if (int(time.time() - start_time) < 180):
            stt = datetime.fromtimestamp(start_time)
            print(f"Start: {stt.strftime('%H:%M:%S')}, Remaining: {time_remaining()}, Red pts: {red_crane}, Blue pts: {blue_crane}, Crane active: {crane_active}, Crane updated: {round(time.time() - crane_updated, 1)}")

            if (int(time.time() - start_time) > 20) and (int(time.time()) != last_n):
                last_n = int(time.time())
                cc = get_crane_active()
                if cc == "red": red_crane += CRANE_MULT
                if cc == "blue": blue_crane += CRANE_MULT
        else:
            last_n = int(time.time())

        time.sleep(0.3)

def match_running():
    return (int(time.time() - start_time) < 180) and (time.time() > start_time)

def time_remaining():
    ret_time = int(180 - (time.time() - start_time))
    if ret_time < 0:
        ret_time = 0

    return ret_time

start_time = time.time() - 170
red_crane = 0
blue_crane = 0
crane_active = "none"
crane_updated = time.time()

def get_crane_active():
    if (time.time() - crane_updated < 2): return crane_active
    return "none"

@app.route("/state")
def state():
    return {
        "time": time_remaining(),
        "red_crane": int(red_crane),
        "blue_crane": int(blue_crane),
        "crane_active": get_crane_active()
    }

@app.route("/cancel_timer")
def cancel_timer():
    global start_time, red_crane, blue_crane, crane_active
    start_time = 0
    red_crane = 0
    blue_crane = 0
    return "OK"

@app.route("/start_timer")
def start_timer():
    global start_time, red_crane, blue_crane, crane_active
    start_time = time.time() + 7
    red_crane = 0
    blue_crane = 0
    return "OK"

@app.route("/set_crane")
def set_crane():
    global crane_active, crane_updated
    crane_active = request.args.get("state", "none")
    crane_updated = time.time()
    return "OK"

def main():
   app.run("0.0.0.0", port=8080, debug=False)

if __name__ == "__main__":
    threading.Thread(target=bg_th_1, daemon=True).start()
    main()

