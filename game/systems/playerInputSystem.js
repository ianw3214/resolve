"use strict";

let playerInputSystem = {
    update: function(entities, delta) {
        for (let i in entities) {
            let player = entities[i];
            if (player.hasOwnProperty("player_input") !== true) {
                continue;
            }
            if (player.player_input.affect !== true) {
                continue;
            }
            if (player.hasOwnProperty("move")) {
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
            }
            if (player.hasOwnProperty("attack")) {
                if (input.keyPressed(49)) {
                    // BASIC ATTACK
                    player.attack.attacks.push("basic");
                }
            }
        }
    }
}