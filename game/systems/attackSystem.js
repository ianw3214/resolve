"use strict";

let attackSystem = {
    generate: function() {
        // TODO: This should not be hard coded
        // TODO: Maybe this can be loaded from a file?
        return {
            // The attacks that are actually being executed
            attacks: [],
            attacking: false,
            // The actual list of attacks
            basic: {
                anim_key: "BASIC_ATTACK",
                cooldown: 150,
                // TODO: Actual attack data (damage, hitbox and stuff)
                // This is the extra data about the attack currently
                curr_cooldown: 0
            }
        }
    },
    update: function(entities, delta) {
        for (let i in entities) {
            let entity = entities[i];
            if (entity.hasOwnProperty("attack")) {
                if (entity.attack.attacking === true) {
                    let attacking = false;
                    for (let key in entity.attack) {
                        let data = entity.attack[key];
                        if (data.hasOwnProperty("curr_cooldown")) {
                            if (data["curr_cooldown"] > 0) {
                                data["curr_cooldown"] -= delta;
                                attacking = true;
                                break;
                            }
                        }
                    }
                    if (attacking === false) {
                        entity.attack.attacking = false;
                    }
                    continue;
                }
                if (entity.attack.attacks.length > 0) {
                    for (let j in entity.attack.attacks) {
                        let attack = entity.attack[entity.attack.attacks[j]];
                        if (attack !== null && attack.curr_cooldown <= 0) {
                            entity.attack["attacking"] = true;
                            attack["curr_cooldown"] = attack.cooldown;
                            if (entity.hasOwnProperty("animation") && attack.hasOwnProperty("anim_key")) {
                                entity.animation.hint = attack["anim_key"];
                            }
                        }
                    }
                }
                entity.attack.attacks = [];
            }
        }
    }
}