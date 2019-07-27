"use strict";

let map = {
    width: 0,
    height: 0,
    tile_map: [],
    collision_map: [],
    tilesheet: {
        source: "",
        tile_size: 32,
        width: 2,
        height: 1
    },
    loaded: false
};

map.load = function(path = null) {
    if (path !== null && typeof path === "string") {
        file.loadJSON(path, function(res) {
            res = JSON.parse(res);
            map.width = res.width;
            map.height = res.height;
            map.tile_map = res.data;
            map.collision_map = res.collision;
            map.tilesheet = res.tilesheet;
            map.loaded = true;
        })
    } else {
        // Initialize default map
        map.width = 10;
        map.height = 10;
        for (let i = 0; i < map.width * map.height; ++i) {
            map.tile_map.push(0);
        }
        loaded = true;
    }
}

map.draw = function (cam_x = 0, cam_y = 0, tile_size = 64) {
    // Update tile size based on the scaling
    tile_size *= scalingSystem.scale;
    // TODO: Get map dimensions from somewhere
    let x, y;
    for (y = 0; y < map.height; ++y) {
        for (x = 0; x < map.width; ++x) {
            let target_x = x * tile_size - cam_x;
            let target_y = y * tile_size - cam_y;
            if (target_x < -tile_size || target_x > graphics.width()) continue;
            if (target_y < -tile_size || target_y > graphics.height()) break;
            let tile = map.tile_map[y * map.width + x];
            // TODO: Use a dictionary of sorts
            // Calculate the source rect from the index
            let source = {
                target: {
                    x: tile % map.tilesheet.width * map.tilesheet.tile_size,
                    y: Math.floor(tile / map.tilesheet.width) * map.tilesheet.tile_size,
                    w: map.tilesheet.tile_size,
                    h: map.tilesheet.tile_size
                },
                w: map.tilesheet.width * map.tilesheet.tile_size,
                h: map.tilesheet.height * map.tilesheet.tile_size
            };
            graphics.drawImageSource(
                graphics.loadImage(map.tilesheet.source),
                source,
                target_x,
                target_y,
                tile_size,
                tile_size
            );
        }
    }
}

map.colliding = function(x, y, shape, tile_size) {
    // Update tile size based on the scaling
    // tile_size *= scalingSystem.scale;
    if (shape.hasOwnProperty("shape") && shape.shape.hasOwnProperty("type")) {
        if (shape.shape.type === "rect") {
            // Update the position with the offsets
            x += shape.offset_x;
            y += shape.offset_y;
            // Skip cases that don't need to be checked
            if (x < 0) return false;
            if (y < 0) return false;
            // Only check with tiles that are relevant
            // TODO: This may become trickier for different shape types
            let round_x = Math.floor(x / tile_size);
            let round_y = Math.floor(y / tile_size);
            let h_num_check = Math.ceil(shape.shape.width / tile_size);
            let v_num_check = Math.ceil(shape.shape.height / tile_size);
            for (let i = round_y; i <= v_num_check + round_y; i++) {
                for (let j = round_x; j <= h_num_check + round_x; j++) {
                    let index = i * map.width + j;
                    if (index > map.collision_map.length) {
                        console.log("FLAG 1");
                        continue;
                    }
                    if (map.collision_map[index] === 0) {
                        continue;
                    }
                    // Check the collision box
                    if (x < (j + 1) * tile_size && x + shape.shape.width > j * tile_size) {
                        if (y < (i + 1) * tile_size && y + shape.shape.height > i * tile_size) {
                            return true;
                        }
                    }
                }
            }
        }
    }
}