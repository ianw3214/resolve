"use strict";

let game = {
    tile_map: [],
    draw_objects: [],
    init: function () {
        // Reset the ECS in case it was in use previously
        ECS.reset();
        ECS.addSystem(scalingSystem);
        ECS.addSystem(cameraSystem);
        ECS.addSystem(animationSystem);
        ECS.addSystem(renderSystem);
        ECS.addSystem(playerInputSystem);
        ECS.addSystem(moveSystem);
        ECS.addSystem(attackSystem);
        ECS.addSystem(healthSystem);
        ECS.addSystem(AISystem);

        map.load("res/maps/test.json");

        // TODO: Uncomment this for background music
        // audio.playTrack("res/sound/track.wav");
    },
    update: function (delta) {
        if (input.keyPressed(81)) {
            graphics.setFullscreen();
        }
        if (input.keyPressed(69)) {
            graphics.exitFullscreen();
        }
        ECS.update(delta);
    },
    draw: function (delta) {
        map.draw(cameraSystem.x, cameraSystem.y);
        // Then draw any game objects
        // First sort by physical position, then sort by layer
        game.draw_objects.sort(function(a, b) { return a.y + a.h - b.y - b.h });
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

// TODO: This should probably somehow go into the collision system
// Keep here for now until figure out how to access the entities without update
game.colliding = function(entity) {
    for (let i in ECS.entities) {
        let target = ECS.entities[i];
        if (entity === target) continue;
        if (entity.hasOwnProperty("position") === false) continue;
        if (target.hasOwnProperty("position") === false) continue;
        if (entity.hasOwnProperty("collision") === false) continue;
        if (target.hasOwnProperty("collision") === false) continue;
        // TODO: Optimize?
        if (entity.collision.shape.type === "rect" && target.collision.shape.type === "rect") {
            let x = entity.position.x + entity.collision.offset_x;
            let y = entity.position.y + entity.collision.offset_y;
            let w = entity.collision.shape.width;
            let h = entity.collision.shape.height;
            let x2 = target.position.x + target.collision.offset_x;
            let y2 = target.position.y + target.collision.offset_y;
            let w2 = target.collision.shape.width;
            let h2 = target.collision.shape.height;
            if (x < x2 + w2 && x + w > x2) {
                if (y < y2 + h2 && y + h > y2) {
                    return true;
                }
            }
        }
    }
    return false;
}