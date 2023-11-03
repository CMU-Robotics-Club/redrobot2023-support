
window.onbeforeunload = function() {
    return true;
};

function reset_timer() {
    if (confirm("Are you sure you want to reset?")) {
        window.onbeforeunload = null;
        window.location.reload();
    }
}

function start_timer() {
    $("#btn-start").remove();
}
