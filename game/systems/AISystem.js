"use strict";

const scout_move_chance = 0.2;
const base_move_time = 1;
const max_move_time = 2;
function update_scout(entity, delta) {
    if (entity.hasOwnProperty("move") === true) {
        let d = new Date();
        let time = d.getTime();
        // If the AI hasn't been initialized yet, initialize it
        if (entity["AI"]["init"] === false) {
            entity["AI"]["init"] = true;
            entity["AI"]["data"] = {
                moving: false,
                direction: 0,
                move_time: 0,
                curr_time: 0,
                last_update: time
            }
        }
        let data = entity["AI"]["data"];
        if (data["moving"] === true) {
            if (data.direction === 0) entity.move.right = true;
            if (data.direction === 1) entity.move.down = true;
            if (data.direction === 2) entity.move.left = true;
            if (data.direction === 3) entity.move.up = true;
            if (data.curr_time > data.move_time) {
                data.moving = false;
            } else {
                data.curr_time += delta;
            }
        } else {
            // See if the scout should move if it isn't moving right now
            if (time - data["last_update"] >= 1000) {
                if (Math.random() <= scout_move_chance) {
                    data.moving = true;
                    data.direction = Math.floor(Math.random() * 4);
                    data.move_time = (base_move_time + Math.floor(Math.random() * max_move_time)) * 1000;
                    data.curr_time = 0;
                }
                data["last_update"] = time;
            }
        }
    }
}

let AISystem = {
    init: function() {

    },
    update: function(entities, delta) {
        for (let entity of entities) {
            if (entity.hasOwnProperty("AI") === true) {
                let type = entity["AI"]["type"];
                if (type === "scout") {
                    update_scout(entity, delta);
                }
            }
        }
    }
};