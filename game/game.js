"use strict";

let player = {
    render: renderSystem.generate("texture", "res/player.png", 64, 64, 100),
    position: {
        x: 200,
        y: 200,
        screen_x: 0,
        screen_y: 0
    },
    move: moveSystem.generate(200),
    camera: cameraSystem.generate(),
    animation: animationSystem.generate("res/player.json"),
    scaling: scalingSystem.generate(),
    collision: collisionSystem.generate(collisionSystem.generateRect(32, 64), 16, 0),
    attack: attackSystem.generate(),
    health: healthSystem.generate()
}

let tree = {
    render: renderSystem.generate("texture", "res/tree.png", 64, 128, 100),
    position: {
        x: 300,
        y: 300,
        screen_x: 0,
        screen_y: 0
    },
    camera: cameraSystem.generate(),
    scaling: scalingSystem.generate(),
    collision: collisionSystem.generate(collisionSystem.generateRect(64, 128), 0, 0)
}

let game = {
    tile_map: [],
    draw_objects: [],
    init: function () {
        map.load("res/maps/test.json");
        // Reset the ECS in case it was in use previously
        ECS.reset();
        ECS.addSystem(scalingSystem);
        ECS.addSystem(cameraSystem);
        ECS.addSystem(animationSystem);
        ECS.addSystem(renderSystem);
        ECS.addSystem(moveSystem);
        ECS.addSystem(attackSystem);
        ECS.addSystem(healthSystem);
        
        ECS.addEntity(player);
        ECS.addEntity(tree);

        // TODO: Uncomment this for background music
        // audio.playTrack("res/sound/track.wav");
    },
    update: function (delta) {
        if (input.keyPressed(68) || input.keyPressed(39)) {
            // game.x += 5;
            player.move.right = true;
        }
        if (input.keyPressed(65) || input.keyPressed(37)) {
            // game.x -= 5;
            player.move.left = true;
        }
        if (input.keyPressed(87) || input.keyPressed(38)) {
            player.move.up = true;
        }
        if (input.keyPressed(83) || input.keyPressed(40)) {
            player.move.down = true;
        }
        if (input.keyPressed(81)) {
            graphics.setFullscreen();
        }
        if (input.keyPressed(69)) {
            graphics.exitFullscreen();
        }
        if (input.keyPressed(49)) {
            // BASIC ATTACK
            player.attack.attacks.push("basic");
        }
        ECS.update(delta);
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