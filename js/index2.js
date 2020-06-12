import { JitsiClient } from "./package/src/lib-jitsi-meet-client.js";
import { Game } from "./package/src/game.js";
const jitsiClient = new JitsiClient();
jitsiClient.joinAsync("Calla", "testUser");
window.jitsiClient = jitsiClient;
window.game = new Game(jitsiClient);