import { JitsiClient } from "./jitsihax-client.js";
import { Game } from "./game.js";
(async function () {
    await import(`https://${JITSI_HOST}/libs/external_api.min.js`);
    const jitsiClient = new JitsiClient(window.JitsiMeetExternalAPI);
    window.game = new Game(jitsiClient);
})();