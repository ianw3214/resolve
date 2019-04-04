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
                    // If there is an animation component, also set the source
                    if (entity.hasOwnProperty("animation")) {
                        game.drawImage(
                            entity.render.path,
                            x,
                            y,
                            entity.render.w,
                            entity.render.h,
                            100,
                            entity.animation.source
                        );
                    } else {
                        game.drawImage(
                            entity.render.path,
                            x,
                            y,
                            entity.render.w,
                            entity.render.h,
                            100
                        );   
                    }
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

var animationSystem = {
    update: function(entities, delta) {
        for (var i in entities) {
            var entity = entities[i];
            if (entity.hasOwnProperty("animation")) {
                // Skip all the calculating if the time is not up yet
                if (entity.time < 41.0) {    // 24 FPS
                    entity.time += delta;
                    continue;
                } else {
                    entity.time = 0.0;
                }
                const data = entity.animation.data;
                // Set the default state if not yet set
                if (entity.animation.state === "") {
                    entity.animation.state = data.default;
                    entity.animation.frame = data.states[data.default].start;
                }
                const curr = entity.animation.state;
                // If there is an animation hint, transition based on it
                if (entity.animation.hint !== "") {
                    if (data.states[curr].transition[entity.animation.hint] !== undefined) {
                        entity.animation.state = data.states[curr].transition[entity.animation.hint];
                    }
                    entity.animation.hint = "";
                } else {
                    // Update the frame and see if it needs to be reset
                    entity.animation.frame += 1;
                    if (entity.animation.frame > data.states[curr].end) {
                        entity.animation.frame = data.states[curr].start;
                    }
                }
                // Finally, update the source rect based on the frame
                const tilesheet = data.tilesheet;
                const frame = entity.animation.frame;
                const x = (frame % tilesheet.columns) * data.frame_width;
                const y = Math.floor(frame / tilesheet.columns) * data.frame_height;
                entity.animation.source = {
                    target: {
                        x: x,
                        y: y,
                        w: data.frame_width,
                        h: data.frame_height,
                    },
                    w: tilesheet.width,
                    h: tilesheet.height
                };
            }
        }
    }
}

var player_animation = {
    default: "IDLE_RIGHT",
    frame_width: 100,
    frame_height: 100,
    tilesheet: {
        width: 200,
        height: 100,
        columns: 10
    },
    states: {
        "IDLE_RIGHT": {
            start: 0,
            end: 1,
            transition: {
                "RUN_RIGHT": "RUN_RIGHT",
                "RUN_LEFT": "RUN_LEFT",
                "RUN_UP": "RUN_UP",
                "RUN_DOWN": "RUN_DOWN"
            },
            loop: true
        },
        "IDLE_LEFT": {
            start: 0,
            end: 1,
            transition: {
                "RUN_RIGHT": "RUN_RIGHT",
                "RUN_LEFT": "RUN_LEFT",
                "RUN_UP": "RUN_UP",
                "RUN_DOWN": "RUN_DOWN"
            },
            loop: true
        },
        "IDLE_UP": {
            start: 0,
            end: 1,
            transition: {
                "RUN_RIGHT": "RUN_RIGHT",
                "RUN_LEFT": "RUN_LEFT",
                "RUN_UP": "RUN_UP",
                "RUN_DOWN": "RUN_DOWN"
            },
            loop: true
        },
        "IDLE_DOWN": {
            start: 0,
            end: 1,
            transition: {
                "RUN_RIGHT": "RUN_RIGHT",
                "RUN_LEFT": "RUN_LEFT",
                "RUN_UP": "RUN_UP",
                "RUN_DOWN": "RUN_DOWN"
            },
            loop: true
        }
    }
}

var player = {
    render: {
        type: "texture",
        path: "res/player.png",
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
    },
    animation: {
        state: "",
        hint: "",
        frame: 0,
        time: 0,
        source: {},
        data: player_animation
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
        ECS.addSystem(animationSystem);
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
                if (obj.source !== null) {
                    graphics.drawImageSource(
                        graphics.loadImage(obj.path),
                        obj.source,
                        obj.x,
                        obj.y,
                        obj.w,
                        obj.h);
                } else {
                    graphics.drawImage(
                        graphics.loadImage(obj.path),
                        obj.x,
                        obj.y,
                        obj.w,
                        obj.h);
                }
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
    drawImage: function (path, x = 0, y = 0, w = 0, h = 0, z = 0, source = null,) {
        game.draw_objects.push({
            type: "texture",
            path: path,
            source: source,
            x: x,
            y: y,
            w: w,
            h: h,
            z: z
        });
    },
}