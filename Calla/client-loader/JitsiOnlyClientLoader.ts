import type { IFetcher } from "kudzu/io/IFetcher";
import type { AudioManager } from "../audio/AudioManager";
import { IMetadataClientExt } from "../meta/IMetadataClient";
import { JitsiMetadataClient } from "../meta/jitsi/JitsiMetadataClient";
import type { JitsiTeleconferenceClient } from "../tele/jitsi/JitsiTeleconferenceClient";
import { BaseJitsiClientLoader } from "./BaseJitsiClientLoader";

export class JitsiOnlyClientLoader extends BaseJitsiClientLoader {
    constructor(host: string, bridgeHost: string, bridgeMUC: string) {
        super(host, bridgeHost, bridgeMUC);
    }

    protected createMetadataClient(_fetcher: IFetcher, _audio: AudioManager, tele: JitsiTeleconferenceClient): IMetadataClientExt {
        if (!this.loaded) {
            throw new Error("lib-jitsi-meet has not been loaded. Call clientFactory.load().");
        }

        tele.useDefaultMetadataClient = true
        return new JitsiMetadataClient(tele);
    }
}
