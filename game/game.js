var game = {
    x: 0,
    y: 0,
    tex: null,
    init: function () {
        game.tex = graphics.loadImage("test.png");
    },
    update: function (delta) {
        if (input.keyPressed(68)) {
            game.x += 5;
        }
        if (input.keyPressed(65)) {
            game.x -= 5;
        }
        if (input.keyPressed(87)) {
            game.y += 5;
        }
        if (input.keyPressed(83)) {
            game.y -= 5;
        }
    },
    draw: function (delta) {
        graphics.drawRect(game.x, game.y);
        graphics.drawRect(50, 50, 100, 100, [1.0, 1.0, 0.0, 1.0]);

        if (game.tex.loaded) graphics.drawImage(game.tex.texture);
    }
}