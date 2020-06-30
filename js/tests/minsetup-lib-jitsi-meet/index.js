import { init } from "../../src/init.js";
import { LibJitsiMeetClient as JitsiClient} from "../../src/jitsi/LibJitsiMeetClient.js";

init("jitsi.calla.chat", new JitsiClient());