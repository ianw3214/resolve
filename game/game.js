// TODO: Implement texture sourcing in the future
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
                if (entity.hasOwnProperty("camera")) {
                    if (entity.camera.affect) {
                        x -= cameraSystem.x;
                        y -= cameraSystem.y;
                    }
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

var cameraSystem = {
    x: 0,
    y: 0,
    init: function() {
        cameraSystem.x = -100;
        cameraSystem.y = -100;
    },
    update: function(entities, delta) {
        // Have the camera follow the player
        // TODO: Calculate target based on movement inputs
        // TODO: Use delta time for camera movement time
        // TODO: Actually center the camera
        var target_x = player.position.x - graphics.width() / 2;
        var target_y = player.position.y - graphics.height() / 2;
        if (cameraSystem.x < target_x) {
            cameraSystem.x += 3;
            if (cameraSystem.x > target_x) cameraSystem.x = target_x;
        }
        if (cameraSystem.x > target_x) {
            cameraSystem.x -= 3;
            if (cameraSystem.x < target_x) cameraSystem.x = target_x;
        }
        if (cameraSystem.y < target_y) {
            cameraSystem.y += 3;
            if (cameraSystem.y > target_y) cameraSystem.y = target_y;
        }
        if (cameraSystem.y > target_y) {
            cameraSystem.y -= 3;
            if (cameraSystem.y < target_y) cameraSystem.y = target_y;
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
    },
    camera: {
        affect: true
    }
}

var game = {
    tile_map: [],
    draw_objects: [],
    init: function () {
        // Generate a map
        for (i = 0; i < 10 * 10; ++i) {
            game.tile_map.push(0);
        }
        // Reset the ECS in case it was in use previously
        ECS.reset();
        ECS.addSystem(cameraSystem);
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
        // Draw the map first
        // TODO: Get map dimensions from somewhere
        for (y = 0; y < 10; ++y) {
            for (x = 0; x < 10; ++x) {
                var target_x = x * 100 - cameraSystem.x;
                var target_y = y * 100 - cameraSystem.y;
                if (target_y < -100 || target_y > 480) break;
                if (target_x < -100 || target_x > 640) continue;
                var tile = game.tile_map[y * 10 + x];
                // TODO: Use a dictionary of sorts
                if (tile === 0) {
                    graphics.drawImage(
                        graphics.loadImage("res/test.png"),
                        target_x,
                        target_y,
                        100,
                        100
                    );
                }
            }
        }
        // Then draw any game objects
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
        graphics.drawImageSource(graphics.loadImage("res/test.png"), {
            target: {
                x: 10,
                y: 10,
                w: 100,
                h: 100
            },
            w: 200,
            h: 200
        }, 0, 0, 50, 50);
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