main();

// Function to represent entry point
function main() {
    input.init();
    graphics.init();

    run();
}

function run() {
    setInterval(tick, 1000/30);
}

var x = 0;
var y = 0;

function tick() {
    // THIS IS JUST TESTING CODE FOR NOW, SEPARATE MORE IN THE FUTURE
    if (input.keyPressed(68)) {
        x += 5;
    }
    if (input.keyPressed(65)) {
        x -= 5;
    }
    if (input.keyPressed(87)) {
        y += 5;
    }
    if (input.keyPressed(83)) {
        y -= 5;
    }
    graphics.clearBuffer();

    graphics.drawRect(x, y);
    graphics.drawRect(50, 50, 100, 100, [1.0, 1.0, 0.0, 1.0]);
}