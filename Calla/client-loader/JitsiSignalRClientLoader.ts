import type { IFetcher } from "kudzu/io/IFetcher";
import type { AudioManager } from "../audio/AudioManager";
import { SignalRMetadataClient } from "../meta/signalr/SignalRMetadataClient";
import type { JitsiTeleconferenceClient } from "../tele/jitsi/JitsiTeleconferenceClient";
import { BaseJitsiClientLoader } from "./BaseJitsiClientLoader";

export class JitsiSignalRClientLoader extends BaseJitsiClientLoader<SignalRMetadataClient> {
    constructor(private signalRPath: string, host: string, bridgeHost: string, bridgeMUC: string) {
        super(host, bridgeHost, bridgeMUC);
    }

    protected createMetadataClient(_fetcher: IFetcher, _audio: AudioManager, _tele: JitsiTeleconferenceClient): SignalRMetadataClient {
        return new SignalRMetadataClient(this.signalRPath);
    }
}
