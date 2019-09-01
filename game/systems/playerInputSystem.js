"use strict";

let playerInputSystem = {
    player: null,   // There should only be one player, so we can cache it
    update: function(entities, delta) {
        if (playerInputSystem.player !== null) {
            let player = playerInputSystem.player;
            if (player.hasOwnProperty("move")) {
                if (input.keyPressed(68) || input.keyPressed(39)) {
                    player.move.right = true;
                }
                if (input.keyPressed(65) || input.keyPressed(37)) {
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
        } else {
            for (let i in entities) {
                let target = entities[i];
                if (target.hasOwnProperty("player_input") === true) {
                    if (target.player_input.affect === true) {
                        playerInputSystem.player = target;
                        break;
                    }   
                }
            }
        }
    }
}