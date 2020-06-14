import { Game } from "./game.js";
import { AppGui } from "./appgui.js";

export function init(JitsiClientClass, appViewElement) {
    const jitsiClient = new JitsiClientClass(),
        game = new Game(jitsiClient),
        gui = new AppGui(appViewElement, game, jitsiClient);

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