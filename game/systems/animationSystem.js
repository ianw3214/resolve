"use strict";

let animationSystem = {
    generate: function(path = "") {
        return {
            state: "",
            hint: "",
            frame: 0,
            time: 0,
            source: {},
            // Loading the data in from another file
            data: {},
            path: path,
            loaded: false,
            loading: false
        }
    },
    update: function (entities, delta) {
        for (let i in entities) {
            let entity = entities[i];
            if (entity.hasOwnProperty("animation")) {
                // Load the animation data if it isn't loaded yet
                if (!entity.animation.loaded) {
                    if (!entity.animation.loading) {
                        file.loadJSON(entity.animation.path, function (response) {
                            // Parse JSON string into object
                            // TODO: Error handling
                            entity.animation.data = JSON.parse(response);
                            entity.animation.loaded = true;
                        });
                        entity.animation.loading = true;
                    }
                    continue;
                }
                // Skip all the calculating if the time is not up yet
                if (entity.time < 42.0) {    // 24 FPS
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
