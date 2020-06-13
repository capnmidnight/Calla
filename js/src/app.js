import { Game } from "./game.js";
import { AppGui } from "./appgui.js";
import { a, span } from "./html.js";

export function init(JitsiClientClass, parentNode) {
    const jitsiClient = new JitsiClientClass(parentNode),
        game = new Game(jitsiClient),
        gui = new AppGui(game, jitsiClient);

    Object.assign(window, {
        jitsiClient,
        game,
        gui
    });

    if (gui.toolbar) {
        gui.toolbar.advertise();
    }

    return game;
}