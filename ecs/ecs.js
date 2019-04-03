var ECS = {
    // The systems stored in the ECS
    systems: [],
    // The entities stored in the ECS
    entities: [],
    // The tick function that updates all entities with systems
    update: function(delta) {
        for (var i in systems) {
            var system = systems[i]
            if (system.hasOwnProperty("update")) {
                if (typeof system.update === "function") {
                    system.update(delta);
                }
            }
        }
    },
    addSystem: function(system) {
        if (system.hasOwnProperty("init")) {
            if (typeof system.init === "function") {
                system.init();
                systems.push(system);
            }
        }
    },
    addEntity: function(entity) {
        if (typeof entity === "object") {
            entities.push(entity);
        }
    },
    reset: function() {
        systems = [];
        entities = [];
    }
}