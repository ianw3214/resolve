// TODO: Implement texture sourcing in the future
// TODO: Put this in draw function of state instead of in ECS lmao
var renderSystem = {
    update: function (entities, delta) {
        for (var i in entities) {
            var entity = entities[i];
            if (entity.hasOwnProperty("render")) {
                if (entity.render.type == "texture") {
                    graphics.drawImage(
                        graphics.loadImage(entity.render.path), 
                        entity.render.x,
                        entity.render.y,
                        entity.render.w,
                        entity.render.h);
                }
                if (entity.render.type === "square") {
                    // TODO: Implement this
                }
                if (entity.render.type === "line") {
                    // TODO: Implement this
                }
            }
        }
    }
}

var player = {
    render: {
        type: "texture",
        path: "test.png",
        x: 0,
        y: 0,
        w: 50,
        h: 50
    }
}

var game = {
    x: 0,
    y: 0,
    tex: null,
    init: function () {
        game.tex = graphics.loadImage("test.png");
        // Reset the ECS in case it was in use previously
        ECS.reset();
        ECS.addSystem(renderSystem);
        ECS.addEntity(player);
    },
    update: function (delta) {
        ECS.update(delta);
        // if (input.keyPressed(68)) {
        //     game.x += 5;
        // }
        // if (input.keyPressed(65)) {
        //     game.x -= 5;
        // }
        // if (input.keyPressed(87)) {
        //     game.y -= 5;
        // }
        // if (input.keyPressed(83)) {
        //     game.y += 5;
        // }
    },
    draw: function (delta) {
        // graphics.drawRect(game.x, game.y);
        // graphics.drawRect(50, 50, 100, 100, [1.0, 1.0, 0.0, 1.0]);

        // graphics.drawImage(game.tex);
    }
}