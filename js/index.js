import { JitsiClient } from "./src/jitsihax-client-external-api.js";
import { init } from "./src/app.js";

init(JitsiClient, document.querySelector("#appView"));