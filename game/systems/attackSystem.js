"use strict";

let attackSystem = {
    update: function(entities, delta) {
        for (let i in entities) {
            let entity = entities[i];
            if (entity.hasOwnProperty("attack")) {
                if (entity.attack.attacking === true) {
                    // If the entity is attacking, just update the timer
                    entity.attack.attack_timer -= delta;
                    if (entity.attack.attack_timer <= 0) {
                        entity.attack.input_attack = null;
                        entity.attack.attacking = false;
                    } else {
                        continue;
                    }
                }
                // Handle the entity attack
                if (entity.attack.input_attack !== null) {
                    let key = entity.attack.input_attack["key"];
                    let attack = entity.attack[key];
                    if (attack === undefined) {
                        entity.attack.input_attack = null;
                        continue;
                    }
                    // Always set the attack timer and attacking flag
                    entity.attack.attacking = true;
                    entity.attack.attack_timer = attack.timer;
                    // Handle other attack effects individually
                    if (key === "basic") {
                        entity.animation.hint = "BASIC_ATTACK";
                    }
                }
            }
        }
    }
}