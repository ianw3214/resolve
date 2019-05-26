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