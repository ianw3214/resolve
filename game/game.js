"use strict";

let player = {
    render: renderSystem.generate("texture", "res/player.png", 64, 64, 100),
    position: {
        x: 50,
        y: 50
    },
    move: moveSystem.generate(200),
    camera: cameraSystem.generate(),
    animation: animationSystem.generate("res/player.json")
}

let game = {
    tile_map: [],
    draw_objects: [],
    init: function () {
        // TODO: Add a file to load the map from
        map.load();
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
        map.draw(cameraSystem.x, cameraSystem.y);
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