"use strict";

let collisionSystem = {
    generate: function(shape) {
        return {
            shape: shape
        };
    },
    update: function(entities, delta) {
        // There may or may not be stuff here in the future
    }
}

collisionSystem.generateRect = function(width, height) {
    return {
        shape: {
            type: "rect",
            width: width,
            height: height
        }
    };
}