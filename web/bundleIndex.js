import { init } from "../js/src/init.js";
import { LibJitsiMeetClient } from "../js/src/jitsi/LibJitsiMeetClient.js";
import { JITSI_HOST, JVB_HOST, JVB_MUC } from "./constants.js";

init(new LibJitsiMeetClient(JITSI_HOST, JVB_HOST, JVB_MUC));