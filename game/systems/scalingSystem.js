"use strict";

/*
 *  The scaling system determines how much to scale the game by the canvas size
 */
let scalingSystem = {
    scale: 1.0,
    generate: function(scaling = true) {
        return {
            scaling: true
        }
    },
    init: function() {
        graphics.addFullscreenCallback((w, h) => {
            // HARD CODED, don't really need a better solution (I think)
            if (w + h < 1500) {
                scalingSystem.scale = 1.0
            } else if (w + h < 2500) {
                scalingSystem.scale = 2.0
            } else {
                scalingSystem.scale = 3.0
            }
        });
    },
    getScale: function() {
        return scale;
    }
}