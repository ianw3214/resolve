// TODO: Implement texture sourcing in the future
// TODO: Put this in draw function of state instead of in ECS lmao
var renderSystem = {
    update: function (entities, delta) {
        for (var i in entities) {
            var entity = entities[i];
            if (entity.hasOwnProperty("render")) {
                var x = 0;
                var y = 0;
                if (entity.hasOwnProperty("position")) {
                    x = entity.position.x;
                    y = entity.position.y;
                }
                if (entity.render.type == "texture") {
                    game.drawImage(
                        entity.render.path,
                        x,
                        y,
                        entity.render.w,
                        entity.render.h,
                        100
                    );
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

var moveSystem = {
    update: function(entities, delta) {
        for (var i in entities) {
            var entity = entities[i];
            if(entity.hasOwnProperty("position") && entity.hasOwnProperty("move")) {
                if (entity.move.up) {
                    entity.position.y -= 5;
                }
                if (entity.move.down) {
                    console.log("DOWN");
                    entity.position.y += 5;
                }
                if (entity.move.left) {
                    entity.position.x -= 5;
                }
                if (entity.move.right) {
                    entity.position.x += 5;
                }
            }
            // RESET MOVEMENT AFTER HANDLING
            entity.move = {
                up: false,
                down: false,
                left: false,
                right: false
            };
        }
    }
}

var player = {
    render: {
        type: "texture",
        path: "res/test.png",
        w: 50,
        h: 50,
        z: 100
    },
    position: {
        x: 50,
        y: 50
    },
    move: {
        up: false,
        down: false,
        left: false,
        right: false
    }
}

var game = {
    draw_objects: [],
    init: function () {
        // Reset the ECS in case it was in use previously
        ECS.reset();
        ECS.addSystem(renderSystem);
        ECS.addSystem(moveSystem);
        ECS.addEntity(player);
    },
    update: function (delta) {
        if (input.keyPressed(68)) {
            // game.x += 5;
            player.move.right = true;
        }
        if (input.keyPressed(65)) {
            // game.x -= 5;
            player.move.left = true;
        }
        if (input.keyPressed(87)) {
            player.move.up = true;
        }
        if (input.keyPressed(83)) {
            player.move.down = true;
        }
        ECS.update(delta);
    },
    draw: function (delta) {
        game.draw_objects.sort(function(a, b) { return a.z - b.z });
        for (var i in game.draw_objects) {
            var obj = game.draw_objects[i];
            if (obj.type == "texture") {
                graphics.drawImage(
                    graphics.loadImage(obj.path),
                    obj.x,
                    obj.y,
                    obj.w,
                    obj.h);
            }
            if (obj.type === "square") {
                // TODO: Implement this
            }
            if (obj.type === "line") {
                // TODO: Implement this
            }
        }
        game.draw_objects = [];
    },
    drawImage: function(path, x=0, y=0, w=0, h=0, z=0) {
        game.draw_objects.push({
            type: "texture",
            path: path,
            x: x,
            y: y,
            w: w,
            h: h,
            z: z
        });
    }
}