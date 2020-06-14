import { JitsiClient } from "../../src/jitsihax-client-lib-jitsi-meet.js";
import { Game } from "../../src/game.js";
const jitsiClient = new JitsiClient();
jitsiClient.joinAsync(null, "Calla", "testUser");
window.jitsiClient = jitsiClient;
window.game = new Game(jitsiClient);