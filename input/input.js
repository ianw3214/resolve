var input = {
    keys: []
};

input.init = function() {
    document.addEventListener("keydown", input.keyDownHandler, false)
    document.addEventListener("keyup", input.keyUpHandler, false);
}

input.keyDownHandler = function(event) {
    if (input.keyPressed(16)) {
        console.log("KEY PRESSED: " + event.keyCode);
    }
    if (!input.keyPressed(event.keyCode)) input.keys.push(event.keyCode);
    // LOG THE KEYCODE IF SHIFT IS PRESSED (for debugging)
}

input.keyUpHandler = function(event) {
    input.keys = input.keys.filter(e => e != event.keyCode);
}

input.keyPressed = function(key) {
    return input.keys.indexOf(key) >= 0;
}