import { JitsiClient } from "./package/src/jitsihax-client-external-api.js";
import { init } from "./package/src/app.js";

init(JitsiClient, document.querySelector("#jitsi"));