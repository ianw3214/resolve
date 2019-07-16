"use strict";

let collisionSystem = {
    generate: function (shape, offset_x = 0, offset_y = 0) {
        return {
            shape: shape,
            offset_x: offset_x,
            offset_y: offset_y
        };
    },
    update: function(entities, delta) {
        // There may or may not be stuff here in the future
    }
}

collisionSystem.generateRect = function(width, height) {
    return {
        type: "rect",
        width: width,
        height: height
    };
}