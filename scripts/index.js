import { JitsiClient } from "./jitsihax-client.js";
import { Game } from "./game.js";
const jitsiClient = new JitsiClient();
window.game = new Game(jitsiClient);