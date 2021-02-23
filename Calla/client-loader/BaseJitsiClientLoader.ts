import type { IFetcher } from "kudzu/io/IFetcher";
import type { progressCallback } from "kudzu/tasks/progressCallback";
import { splitProgress } from "kudzu/tasks/splitProgress";
import type { AudioManager } from "../audio/AudioManager";
import type { IMetadataClientExt } from "../meta/IMetadataClient";
import { JitsiTeleconferenceClient } from "../tele/jitsi/JitsiTeleconferenceClient";
import { BaseClientLoader } from "./BaseClientLoader";

const jQueryPath = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js";

export abstract class BaseJitsiClientLoader<MetaT extends IMetadataClientExt> extends BaseClientLoader <JitsiTeleconferenceClient, MetaT> {

    protected loaded = false;

    constructor(protected host: string, protected bridgeHost: string, protected bridgeMUC: string) {
        super();
    }

    async _load(fetcher: IFetcher, onProgress?: progressCallback): Promise<void> {
        if (!this.loaded) {
            console.info("Connecting to:", this.host);
            const progs = splitProgress(onProgress, [1, 3]);
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

    protected createTeleconferenceClient(fetcher: IFetcher, audio: AudioManager): JitsiTeleconferenceClient {
        if (!this.loaded) {
            throw new Error("lib-jitsi-meet has not been loaded. Call clientFactory.load().");
        }

        return new JitsiTeleconferenceClient(fetcher, audio, this.host, this.bridgeHost, this.bridgeMUC);
    }
}

