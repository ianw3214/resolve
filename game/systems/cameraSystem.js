"use strict";

const base_camera_speed = 500;
let cameraSystem = {
    x: 0,
    y: 0,
    // Cache these because needed for fullscreen callback
    player_x: 0,
    player_y: 0,
    player_w: 0,
    player_h: 0,
    // Cache player to improve performance
    player: null,
    reset_camera: false,
    generate: function(affect = true) {
        return {
            affect: affect
        };
    },
    init: function () {
        cameraSystem.x = -100;
        cameraSystem.y = -100;
        // Add a callback to adjust camera position when fullscreen changes
        // NOTE: This callback has to be done AFTER the scaling system callback
        // The fix as of right now is just initializing the scaling system first
        // If more systems need this kind of feature, something more elegant may be needed
        graphics.addFullscreenCallback((w, h) => {
            cameraSystem.reset_camera = true;
        });
    },
    update: function (entities, delta) {
        // Look for the player first (Assume there is only one)
        if (cameraSystem.player === null || cameraSystem.reset_camera === true) {
            for (let entity of entities) {
                if (entity.hasOwnProperty("player_input") === true) {
                    // Cache these things so fullscreen callback can use
                    cameraSystem.player_x = entity.position.x;
                    cameraSystem.player_y = entity.position.y;
                    cameraSystem.player_w = entity.render.w;
                    cameraSystem.player_h = entity.render.h;
                    cameraSystem.player = entity;
                    // There should only be one, so we can break once we find it
                    break;
                }
            }
        }
        if (cameraSystem.player === null) return;
        if (cameraSystem.reset_camera === true) {
            cameraSystem.x = cameraSystem.player_x * scalingSystem.scale - graphics.width() / 2 + cameraSystem.player_w * scalingSystem.scale / 2;
            cameraSystem.y = cameraSystem.player_y * scalingSystem.scale - graphics.height() / 2 + cameraSystem.player_h * scalingSystem.scale / 2;
            cameraSystem.reset_camera = false;
        }
        let player = cameraSystem.player;
        // Have the camera follow the player
        // TODO: Calculate target based on movement inputs
        let target_x = player.position.x * scalingSystem.scale - graphics.width() / 2 + player.render.w * scalingSystem.scale / 2;
        let target_y = player.position.y * scalingSystem.scale - graphics.height() / 2 + player.render.h * scalingSystem.scale / 2;
        if (cameraSystem.x < target_x) {
            cameraSystem.x += base_camera_speed * delta / 1000;
            if (cameraSystem.x > target_x) cameraSystem.x = target_x;
        }
        if (cameraSystem.x > target_x) {
            cameraSystem.x -= base_camera_speed * delta / 1000;
            if (cameraSystem.x < target_x) cameraSystem.x = target_x;
        }
        if (cameraSystem.y < target_y) {
            cameraSystem.y += base_camera_speed * delta / 1000;
            if (cameraSystem.y > target_y) cameraSystem.y = target_y;
        }
        if (cameraSystem.y > target_y) {
            cameraSystem.y -= base_camera_speed * delta / 1000;
            if (cameraSystem.y < target_y) cameraSystem.y = target_y;
        }
    }
}