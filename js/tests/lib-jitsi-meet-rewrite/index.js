import { LibJitsiMeetClient as JitsiClient } from "../../src/jitsi/libJitsiMeetClient.js";
import { Game } from "../../src/game.js";
const jitsiClient = new JitsiClient();
jitsiClient.joinAsync("Calla", "testUser");
window.jitsiClient = jitsiClient;
window.game = new Game();