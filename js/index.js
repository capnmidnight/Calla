import { init } from "./src/init.js";
import { LibJitsiMeetClient as JitsiClient } from "./src/jitsi/LibJitsiMeetClient.js";
init(new JitsiClient());