import { init } from "../../src/init.js";
import { ExternalJitsiClient as JitsiClient } from "../../src/jitsi/ExternalJitsiClient.js";

init("jitsi.calla.chat", new JitsiClient());