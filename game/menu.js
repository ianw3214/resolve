var menu = {
    tex: null,
    init: function() {
        tex = graphics.loadImage("test.png");
    },
    update: function() {
        if (input.keyPressed(68)) {
            engine.setState(game);
        }
    },
    draw: function() {
        if (tex.loaded) graphics.drawImage(tex.texture, 50, 50);
    }
}