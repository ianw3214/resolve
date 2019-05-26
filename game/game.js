"use strict";

let renderSystem = {
    update: function (entities, delta) {
        for (let i in entities) {
            let entity = entities[i];
            if (entity.hasOwnProperty("render")) {
                let x = 0;
                let y = 0;
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
                        if (entity.animation.loaded) {
                            game.drawImage(
                                entity.render.path,
                                x,
                                y,
                                entity.render.w,
                                entity.render.h,
                                100,
                                entity.animation.source
                            );
                        }
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
                    game.draw_objects.push({
                        type: "square",
                        x: x,
                        y: y,
                        w: w,
                        h: h,
                        z: z,
                        color: entity.render.color
                    });
                    
                }
                if (entity.render.type === "line") {
                    // TODO: Implement this
                }
            }
        }
    }
}

let moveSystem = {
    update: function(entities, delta) {
        for (let i in entities) {
            let entity = entities[i];
            let moving = false;
            if(entity.hasOwnProperty("position") && entity.hasOwnProperty("move")) {
                if (entity.move.up) {
                    moving = true;
                    entity.position.y -= 5;
                    if (entity.hasOwnProperty("animation")) {
                        entity.animation.hint = "RUN_UP";
                    }
                }
                if (entity.move.down) {
                    moving = true;
                    entity.position.y += 5;
                    if (entity.hasOwnProperty("animation")) {
                        entity.animation.hint = "RUN_DOWN";
                    }
                }
                if (entity.move.left) {
                    moving = true;
                    entity.position.x -= 5;
                    if (entity.hasOwnProperty("animation")) {
                        entity.animation.hint = "RUN_LEFT";
                    }
                }
                if (entity.move.right) {
                    moving = true;
                    entity.position.x += 5;
                    if (entity.hasOwnProperty("animation")) {
                        entity.animation.hint = "RUN_RIGHT";
                    }
                }
            }
            if (entity.move.was_moving && moving == false) {
                if (entity.hasOwnProperty("animation")) {
                    entity.animation.hint = "IDLE";
                }
            }
            // RESET MOVEMENT AFTER HANDLING
            entity.move = {
                up: false,
                down: false,
                left: false,
                right: false,
                was_moving: moving
            };
        }
    }
}

const base_camera_speed = 500;
let cameraSystem = {
    x: 0,
    y: 0,
    init: function() {
        cameraSystem.x = -100;
        cameraSystem.y = -100;
    },
    update: function(entities, delta) {
        // Have the camera follow the player
        // TODO: Calculate target based on movement inputs
        let target_x = player.position.x - graphics.width() / 2 + player.render.w / 2;
        let target_y = player.position.y - graphics.height() / 2 + player.render.h / 2;
        if (cameraSystem.x < target_x) {
            cameraSystem.x += base_camera_speed * delta / 1000;
            if (cameraSystem.x > target_x) cameraSystem.x = target_x;
        }
        if (cameraSystem.x > target_x) {
            cameraSystem.x -= base_camera_speed * delta / 1000;
            if (cameraSystem.x < target_x) cameraSystem.x = target_x;
        }
        if (cameraSystem.y < target_y) {
            cameraSystem.y += base_camera_speed * delta / 1000;
            if (cameraSystem.y > target_y) cameraSystem.y = target_y;
        }
        if (cameraSystem.y > target_y) {
            cameraSystem.y -= base_camera_speed * delta / 1000;
            if (cameraSystem.y < target_y) cameraSystem.y = target_y;
        }
    }
}

let animationSystem = {
    update: function(entities, delta) {
        for (let i in entities) {
            let entity = entities[i];
            if (entity.hasOwnProperty("animation")) {
                // Load the animation if it isn't loaded yet
                if (!entity.animation.loaded) {
                    if (!entity.animation.loading) {
                        file.loadJSON(entity.animation.path, function (response) {
                            // Parse JSON string into object
                            entity.animation.data = JSON.parse(response);
                            entity.animation.loaded = true;
                        });
                        entity.animation.loading = true;
                    }
                    continue;
                }
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
                if (entity.animation.hint !== "" && data.states[curr].transition[entity.animation.hint] !== undefined) {
                    entity.animation.state = data.states[curr].transition[entity.animation.hint];
                    entity.animation.frame = data.states[entity.animation.state].start;
                } else {
                    // Update the frame and see if it needs to be reset
                    entity.animation.frame += 1;
                    // TODO: If the animation shouldn't loop, go to some default state
                    if (entity.animation.frame > data.states[curr].end) {
                        entity.animation.frame = data.states[curr].start;
                    }
                }
                entity.animation.hint = "";
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

let player = {
    render: {
        type: "texture",
        path: "res/player.png",
        w: 100,
        h: 100,
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
        right: false,
        was_moving: false
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
        // Loading the data in from another file
        data: {},
        path: "res/player.json",
        loaded: false,
        loading: false
    }
}

let game = {
    tile_map: [],
    draw_objects: [],
    init: function () {
        // Generate a map
        for (let i = 0; i < 10 * 10; ++i) {
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
        if (input.keyPressed(81)) {
            graphics.setFullscreen();
        }
        if (input.keyPressed(69)) {
            graphics.exitFullscreen();
        }
        ECS.update(delta);
        let canvas = document.getElementById("glCanvas");
    },
    draw: function (delta) {
        // Draw the map first
        // TODO: Get map dimensions from somewhere
        let x, y;
        for (y = 0; y < 10; ++y) {
            for (x = 0; x < 10; ++x) {
                let target_x = x * 100 - cameraSystem.x;
                let target_y = y * 100 - cameraSystem.y;
                if (target_x < -100 || target_x > graphics.width()) continue;
                if (target_y < -100 || target_y > graphics.height()) break;
                let tile = game.tile_map[y * 10 + x];
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
        for (let i in game.draw_objects) {
            let obj = game.draw_objects[i];
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
                let color = error_color;
                if (obj.color !== null && obj.color !== undefined) color = obj.color;
                graphics.drawRect(obj.x, obj.y, obj.w, obj.h, color);
            }
            if (obj.type === "line") {
                // TODO: Implement this
            }
        }
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