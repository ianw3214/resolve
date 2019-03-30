var menu = {
    background: null,
    init: function() {
        tex = graphics.loadImage("res/menu/background.png");
    },
    close: function() {
        console.log("CLOSE");
    },
    update: function() {
        if (input.keyPressed(68)) {
            engine.setState(game);
        }
    },
    draw: function() {
        if (tex.loaded) graphics.drawImage(tex.texture, 0, 0, 640, 480);
    }
}