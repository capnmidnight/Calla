import type { IFetcher } from "kudzu/io/IFetcher";
import type { progressCallback } from "kudzu/tasks/progressCallback";
import type { AudioManager } from "../audio/AudioManager";
import { JitsiTeleconferenceClient } from "../tele/jitsi/JitsiTeleconferenceClient";
import { BaseClientLoader } from "./BaseClientLoader";
export declare abstract class BaseJitsiClientLoader extends BaseClientLoader<JitsiTeleconferenceClient> {
    protected host: string;
    protected bridgeHost: string;
    protected bridgeMUC: string;
    protected loaded: boolean;
    constructor(host: string, bridgeHost: string, bridgeMUC: string);
    _load(fetcher: IFetcher, onProgress?: progressCallback): Promise<void>;
    protected createTeleconferenceClient(fetcher: IFetcher, audio: AudioManager): JitsiTeleconferenceClient;
}
