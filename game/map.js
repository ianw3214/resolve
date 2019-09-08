"use strict";

const map_vertex = `
    precision lowp float;

    attribute vec2 a_pos;
    attribute vec2 a_tex;

    uniform float u_screenWidth;
    uniform float u_screenHeight;

    uniform float u_offset_x;
    uniform float u_offset_y;
    uniform float u_scale;

    varying vec2 v_texCoord;

    void main() {
        float x = ((floor(u_scale * a_pos.x) + u_offset_x) / u_screenWidth) * 2.0 - 1.0;
        float y = -(((floor(u_scale * a_pos.y) + u_offset_y) / u_screenHeight) * 2.0 - 1.0);
        gl_Position = vec4(x, y, 0.0, 1.0);

        v_texCoord = a_tex;
    }`;

const map_texture = `
    precision mediump float;
    uniform sampler2D u_image;
    varying vec2 v_texCoord;
    void main() {
        gl_FragColor = texture2D(u_image, v_texCoord);
    }`;

let map_shader = null;

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
    // Some metadata
    num_entities: 0,
    loaded_entities: 0,
    loaded: false,
    // Variables for map batching
    positionBuffer: null,
    texCoordBuffer: null
};

// Replaces the overriden properties in the archetype from the entity
function override_properties(archetype, entity) {
    const keys = Object.keys(entity);
    for (let key of keys) {
        if (typeof key === "object") {
            override_properties(archetype[key], entity[key]);
        } else {
            archetype[key] = entity[key];
        }
    }
}

function createMap() {
    map.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, map.positionBuffer);
    
    let buffer = [];
    for(let y = 0; y < map.height; ++y) {
        for(let x = 0; x < map.width; ++x) {
            buffer.push(
                x * 64, y * 64, 
                x * 64 + 64, y * 64,
                x * 64, y * 64 + 64,
                x * 64, y * 64 + 64,
                x * 64 + 64, y * 64,
                x * 64 + 64, y * 64 + 64
            );
        }
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(buffer), gl.DYNAMIC_DRAW);

    map.texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, map.texcoordBuffer);

    let tex_buffer = [];
    for (let y = 0; y < map.height; ++y) {
        for (let x = 0; x < map.width; ++x) {
            let tile = map.tile_map[y * map.width + x];
            let width = map.tilesheet.width * map.tilesheet.tile_size;
            let height = map.tilesheet.height * map.tilesheet.tile_size;
            let src_x = (tile % map.tilesheet.width * map.tilesheet.tile_size) / width;
            let src_y = (Math.floor(tile / map.tilesheet.width) * map.tilesheet.tile_size) / height;
            let src_w = (map.tilesheet.tile_size) / width;
            let src_h = (map.tilesheet.tile_size) / height;
            tex_buffer.push(
                src_x, src_y,
                src_x + src_w, src_y,
                src_x, src_y + src_h,
                src_x, src_y + src_h,
                src_x + src_w, src_y,
                src_x + src_w, src_y + src_h
            );
        }
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tex_buffer), gl.DYNAMIC_DRAW);
}

map.load = function(path = null) {
    // If the map shader hasn't been loaded yet, load it
    if (map_shader === null) {
        map_shader = graphics.createShaderProgram(map_vertex, map_texture);
        gl.useProgram(map_shader);
        gl.uniform1f(gl.getUniformLocation(map_shader, "u_screenWidth"), graphics.width());
        gl.uniform1f(gl.getUniformLocation(map_shader, "u_screenHeight"), graphics.height());
    }
    if (path !== null && typeof path === "string") {
        file.loadJSON(path, function(res) {
            res = JSON.parse(res);
            map.width = res.width;
            map.height = res.height;
            map.tile_map = res.data;
            map.collision_map = res.collision;
            map.tilesheet = res.tilesheet;

            createMap();

            // Load the entities
            map.num_entities = res.entities.length;
            map.loaded_entities = 0;
            for (let i in res.entities) {
                let entity = res.entities[i];
                let archetype_path = "res/archetypes/" + entity["archetype"] + ".JSON"
                file.loadJSON(archetype_path, function(res) {
                    let ent = JSON.parse(res);
                    override_properties(ent, entity)
                    ECS.addEntity(ent);
                    // Finish loading the map once all the entities are loaded
                    map.loaded_entities++;
                    if (map.loaded_entities == map.num_entities) {
                        map.loaded = true;
                    }
                }, function() {
                    // The error callback
                    // TODO: Make something really bad happen here (or not)
                });
            }

            // ALSO HAVE TO WAIT FOR ENTITIES TO LOAD
            // map.loaded = true;
        });
    } else {
        // TODO: Make this an error somehow
        // Initialize default map
        map.width = 10;
        map.height = 10;
        for (let i = 0; i < map.width * map.height; ++i) {
            map.tile_map.push(0);
        }
        loaded = true;
    }

    // Add the resize function
    graphics.addFullscreenCallback((w, h) => {
        gl.useProgram(map_shader);
        gl.uniform1f(gl.getUniformLocation(map_shader, "u_screenWidth"), w);
        gl.uniform1f(gl.getUniformLocation(map_shader, "u_screenHeight"), h);
    });
}

map.draw = function (cam_x = 0, cam_y = 0) {
    if (map_shader !== null) {
        gl.bindTexture(gl.TEXTURE_2D, graphics.loadImage(map.tilesheet.source).texture);
        gl.useProgram(map_shader);

        gl.uniform1f(gl.getUniformLocation(map_shader, "u_offset_x"), -cam_x);
        gl.uniform1f(gl.getUniformLocation(map_shader, "u_offset_y"), -cam_y);
        gl.uniform1f(gl.getUniformLocation(map_shader, "u_scale"), scalingSystem.scale);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, map.positionBuffer);
        gl.bindBuffer(gl.ARRAY_BUFFER, map.texCoordBuffer);

        let positionLocation = gl.getAttribLocation(map_shader, "a_pos");
        let texCoordLocation = gl.getAttribLocation(map_shader, "a_tex");

        gl.enableVertexAttribArray(positionLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, map.positionBuffer);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(texCoordLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, map.texcoordBuffer);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.TRIANGLES, 0, 6 * map.width * map.height);
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