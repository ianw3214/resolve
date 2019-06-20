"use strict";

let renderSystem = {
    generate: function(type = "square", path = "", w = 10, h = 10, z = 0, color = error_colour) {
        return {
            type: type,
            path: path,
            w: w,
            h: h,
            z: z,
            color: color
        }
    },
    update: function (entities, delta) {
        for (let i in entities) {
            let entity = entities[i];
            if (entity.hasOwnProperty("render")) {
                let x = 0;
                let y = 0;
                let scaled_w = entity.render.w;
                let scaled_h = entity.render.h;
                if (entity.hasOwnProperty("scaling")) {
                    if (entity.scaling.scaling === true) {
                        scaled_w *= scalingSystem.scale;
                        scaled_h *= scalingSystem.scale;
                        console.log(scalingSystem.scale);
                    }
                }
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
                                scaled_w,
                                scaled_h,
                                100,
                                entity.animation.source
                            );
                        }
                    } else {
                        game.drawImage(
                            entity.render.path,
                            x,
                            y,
                            scaled_w,
                            scaled_h,
                            100
                        );
                    }
                }
                if (entity.render.type === "square") {
                    game.draw_objects.push({
                        type: "square",
                        x: x,
                        y: y,
                        w: scaled_w,
                        h: scaled_h,
                        z: entity.render.z,
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