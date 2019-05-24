"use strict";

const STATE_CONTINUE = 0;
const STATE_SETTINGS = 1;
const STATE_CREDITS = 2;

let menu = {
    background: null,
    tex: null,
    state: 0,
    init: function() {
        menu.tex = graphics.loadImage("res/menu/background.png");
    },
    close: function() {
        // Clean up any resources here...
    },
    update: function() {
        if (input.keyPressed(13) || input.keyPressed(32)) {
            // DO THINGS DEPENDING ON THE MENU STATE
            if (menu.state === STATE_CONTINUE) {
                engine.setState(game);
            }
            if (menu.state === STATE_SETTINGS) {

            }
            if (menu.state === STATE_CREDITS) {

            }
        }
        if (input.keyPressed(87) || input.keyPressed(38)) {
            // UP
            menu.state -= 1;
            if (menu.state < STATE_CONTINUE) menu.state = STATE_CONTINUE;
        }
        if (input.keyPressed(83) || input.keyPressed(40)) {
            // DOWN
            menu.state += 1;
            if (menu.state > STATE_CREDITS) menu.state = STATE_CREDITS;
        }
    },
    draw: function() {
        // DRAW THE BACKGROUND
        graphics.drawImage(menu.tex, 0, 0, 640, 480);
    }
}