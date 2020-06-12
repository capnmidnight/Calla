import { JitsiClient } from "./package/src/jitsihax-client.js";
import { Game } from "./package/src/game.js";
import { AppGui } from "./package/src/appgui.js";

//import { JitsiClient, Game, AppGui } from "./package/calla.min.js";

(async function () {
    await import(`https://${JITSI_HOST}/libs/external_api.min.js`);
    const jitsiClient = new JitsiClient(
        JitsiMeetExternalAPI,
        document.querySelector("#jitsi")),
        game = new Game(jitsiClient),
        gui = new AppGui(game);

    Object.assign(window, {
        game,
        gui
    });
})();