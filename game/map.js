"use strict";

let map = {
    width: 0,
    height: 0,
    tile_map: [],
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