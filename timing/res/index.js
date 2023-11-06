
/*window.onbeforeunload = function() {
    return true;
};*/

var TELEOP_START = 160;

setInterval(function() {
    $.get("/state", (res) => {
        update_state(res);
    })
}, 100);

function reset_timer() {
    if (confirm("Are you sure you want to restart?")) $.get("/start_timer");
}

function cancel_timer() {
    if (confirm("Are you sure you want to cancel?")) $.get("/cancel_timer");
}

function update_state(state) {
    if (state.time > 180) {
        $("#countdown").css("display", "block");
        $("#timer").css("display", "none");
        $("#period").css("display", "none");
        $("#blue_crane_box").css("display", "none");
        $("#red_crane_box").css("display", "none");

        if (state.time >= 186) {
            $("#cd5").css("font-weight", "bold").css("color", "orange")
            $("#cd4").css("font-weight", "").css("color", "")
            $("#cd3").css("font-weight", "").css("color", "")
            $("#cd2").css("font-weight", "").css("color", "")
            $("#cd1").css("font-weight", "").css("color", "")
            $("#cd0").css("font-weight", "").css("color", "")
        }
        else if (state.time == 185) {
            $("#cd4").css("font-weight", "bold").css("color", "orange")
            $("#cd5").css("font-weight", "").css("color", "")
            $("#cd3").css("font-weight", "").css("color", "")
            $("#cd2").css("font-weight", "").css("color", "")
            $("#cd1").css("font-weight", "").css("color", "")
            $("#cd0").css("font-weight", "").css("color", "")
        }
        else if (state.time == 184) {
            $("#cd3").css("font-weight", "bold").css("color", "orange")
            $("#cd5").css("font-weight", "").css("color", "")
            $("#cd4").css("font-weight", "").css("color", "")
            $("#cd2").css("font-weight", "").css("color", "")
            $("#cd1").css("font-weight", "").css("color", "")
            $("#cd0").css("font-weight", "").css("color", "")
        }
        else if (state.time == 183) {
            $("#cd2").css("font-weight", "bold").css("color", "orange")
            $("#cd5").css("font-weight", "").css("color", "")
            $("#cd4").css("font-weight", "").css("color", "")
            $("#cd3").css("font-weight", "").css("color", "")
            $("#cd1").css("font-weight", "").css("color", "")
            $("#cd0").css("font-weight", "").css("color", "")
        }
        else if (state.time == 182) {
            $("#cd1").css("font-weight", "bold").css("color", "orange")
            $("#cd5").css("font-weight", "").css("color", "")
            $("#cd4").css("font-weight", "").css("color", "")
            $("#cd3").css("font-weight", "").css("color", "")
            $("#cd2").css("font-weight", "").css("color", "")
            $("#cd0").css("font-weight", "").css("color", "")
        }
        else if (state.time == 181) {
            $("#cd0").css("font-weight", "bold").css("color", "orange")
            $("#cd5").css("font-weight", "").css("color", "")
            $("#cd4").css("font-weight", "").css("color", "")
            $("#cd3").css("font-weight", "").css("color", "")
            $("#cd2").css("font-weight", "").css("color", "")
            $("#cd1").css("font-weight", "").css("color", "")
        }
    } else {
        $("#countdown").css("display", "none");
        $("#timer").css("display", "block");
        $("#period").css("display", "block");
        $("#blue_crane_box").css("display", "block");
        $("#red_crane_box").css("display", "block");

        var mins = parseInt(state.time / 60);
        var secs = state.time % 60;
        secs = "" + secs;
        if (secs.length == 1) secs = "0"+secs;
        $("#timer").text(mins+":"+secs);

        if (state.time > TELEOP_START) {
            $("#period").text("Autonomous Period")
        } else if (state.time == 0) {
            $("#period").text("End of Match")
        } else {
            $("#period").text("Teleoperated Period")
        }

        $("#red_crane_pts").text(state.red_crane);
        $("#blue_crane_pts").text(state.blue_crane);

        if (state.crane_active == "red") {
            $("#red_crane_box").css("border", "10px solid orange");
            $("#blue_crane_box").css("border", "10px solid #00000000");
        }
        else if (state.crane_active == "blue") {
            $("#red_crane_box").css("border", "10px solid #00000000");
            $("#blue_crane_box").css("border", "10px solid orange");
        }
        else {
            $("#red_crane_box").css("border", "10px solid #00000000");
            $("#blue_crane_box").css("border", "10px solid #00000000");
        }

    }
}
