import { JitsiClient } from "../../package/src/jitsihax-client-lib-jitsi-meet.js";
import { Game } from "../../package/src/game.js";
const jitsiClient = new JitsiClient();
jitsiClient.joinAsync("Calla", "testUser");
window.jitsiClient = jitsiClient;
window.game = new Game(jitsiClient);