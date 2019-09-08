"use strict";

let playerInputSystem = {
    player: null,   // There should only be one player, so we can cache it
    update: function(entities, delta) {
        if (playerInputSystem.player !== null) {
            let player = playerInputSystem.player;
            if (player.hasOwnProperty("move")) {
                let direction = 0;
                if (input.keyPressed(68) || input.keyPressed(39)) {
                    player.move.right = true;
                    direction = 1;
                }
                if (input.keyPressed(65) || input.keyPressed(37)) {
                    player.move.left = true;
                    direction = 3;
                }
                if (input.keyPressed(87) || input.keyPressed(38)) {
                    player.move.up = true;
                    direction = 0;
                }
                if (input.keyPressed(83) || input.keyPressed(40)) {
                    player.move.down = true;
                    direction = 2;
                }
                // Let the player face a direction if possible
                player.position["facing"] = direction;
            }
            if (player.hasOwnProperty("attack")) {
                if (input.keyPressed(49)) {
                    // BASIC ATTACK
                    player.attack.input_attack = {
                        "key" : "basic",
                        "direction" : player.position["facing"]
                    };
                }
            }
        } else {
            for (let i in entities) {
                let target = entities[i];
                if (target.hasOwnProperty("player_input") === true) {
                    if (target.player_input.affect === true) {
                        playerInputSystem.player = target;
                        playerInputSystem.player.position["facing"] = 0;
                        break;
                    }   
                }
            }
        }
    }
}