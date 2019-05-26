"use strict";

const base_camera_speed = 500;
let cameraSystem = {
    x: 0,
    y: 0,
    init: function () {
        cameraSystem.x = -100;
        cameraSystem.y = -100;
    },
    update: function (entities, delta) {
        // Have the camera follow the player
        // TODO: Calculate target based on movement inputs
        let target_x = player.position.x - graphics.width() / 2 + player.render.w / 2;
        let target_y = player.position.y - graphics.height() / 2 + player.render.h / 2;
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