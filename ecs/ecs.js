"use strict";

let ECS = {
    // The systems stored in the ECS
    systems: [],
    // The entities stored in the ECS
    entities: [],
    // The tick function that updates all entities with systems
    update: function(delta) {
        for (let i in ECS.systems) {
            let system = ECS.systems[i];
            if (system.hasOwnProperty("update")) {
                if (typeof system.update === "function") {
                    system.update(ECS.entities, delta);
                }
            }
        }
    },
    addSystem: function(system) {
        if (system.hasOwnProperty("init")) {
            if (typeof system.init === "function") {
                system.init();
            }
        }
        ECS.systems.push(system);
    },
    addEntity: function(entity) {
        if (typeof entity === "object") {
            ECS.entities.push(entity);
        }
    },
    reset: function() {
        ECS.systems = [];
        ECS.entities = [];
    }
}