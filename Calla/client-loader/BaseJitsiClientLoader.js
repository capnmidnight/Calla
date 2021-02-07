import { splitProgress } from "kudzu/tasks/splitProgress";
import { JitsiTeleconferenceClient } from "../tele/jitsi/JitsiTeleconferenceClient";
import { BaseClientLoader } from "./BaseClientLoader";
const jQueryPath = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js";
export class BaseJitsiClientLoader extends BaseClientLoader {
    constructor(host, bridgeHost, bridgeMUC) {
        super();
        this.host = host;
        this.bridgeHost = bridgeHost;
        this.bridgeMUC = bridgeMUC;
        this.loaded = false;
    }
    async _load(fetcher, onProgress) {
        if (!this.loaded) {
            console.info("Connecting to:", this.host);
            const progs = splitProgress(onProgress, 2);
            await fetcher.loadScript(jQueryPath, () => "jQuery" in globalThis, progs.shift());
            await fetcher.loadScript(`https://${this.host}/libs/lib-jitsi-meet.min.js`, () => "JitsiMeetJS" in globalThis, progs.shift());
            if (process.env.NODE_ENV === "development") {
                JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
            }
            else {
                JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
            }
            JitsiMeetJS.init();
            this.loaded = true;
        }
    }
    createTeleconferenceClient(fetcher, audio) {
        if (!this.loaded) {
            throw new Error("lib-jitsi-meet has not been loaded. Call clientFactory.load().");
        }
        return new JitsiTeleconferenceClient(fetcher, audio, this.host, this.bridgeHost, this.bridgeMUC);
    }
}
//# sourceMappingURL=BaseJitsiClientLoader.js.map