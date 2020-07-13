/* global JITSI_HOST */
import { init } from "./src/init.js";
import { LibJitsiMeetClient as JitsiClient } from "./src/jitsi/LibJitsiMeetClient.js";
init(JITSI_HOST, new JitsiClient());