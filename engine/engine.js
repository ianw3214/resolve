var engine = {
    lastRender: 0,
    state: {}
};

engine.init = function() {
    input.init();
    graphics.init();
}

engine.start = function(state = null) {
    if (state != null) engine.setState(state);
    window.requestAnimationFrame(engine.tick)
}

engine.setState = function(state) {
    if (state.hasOwnProperty("init")) {
        if (typeof state.init === "function") {
            state.init();
        }
    }
    engine.state = state;
}

engine.update = function(delta) {
    // Update the state of the world for the elapsed time since last render
    if (engine.state.hasOwnProperty("update")) {
        if (typeof engine.state.update === "function") {
            engine.state.update(delta);
        }
    }
}

engine.draw = function(delta) {
    graphics.clearBuffer();
    // Draw the state of the world
    if (engine.state.hasOwnProperty("draw")) {
        if (typeof engine.state.draw === "function") {
            engine.state.draw(delta);
        }
    }
}

engine.tick = function(timestamp) {
    var delta = timestamp - engine.lastRender

    engine.update(delta)
    engine.draw(delta)

    engine.lastRender = timestamp
    window.requestAnimationFrame(engine.tick)
}