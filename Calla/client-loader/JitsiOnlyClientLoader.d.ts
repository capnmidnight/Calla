import type { IFetcher } from "kudzu/io/IFetcher";
import type { AudioManager } from "../audio/AudioManager";
import { IMetadataClientExt } from "../meta/IMetadataClient";
import type { JitsiTeleconferenceClient } from "../tele/jitsi/JitsiTeleconferenceClient";
import { BaseJitsiClientLoader } from "./BaseJitsiClientLoader";
export declare class JitsiOnlyClientLoader extends BaseJitsiClientLoader {
    constructor(host: string, bridgeHost: string, bridgeMUC: string);
    protected createMetadataClient(_fetcher: IFetcher, _audio: AudioManager, tele: JitsiTeleconferenceClient): IMetadataClientExt;
}
