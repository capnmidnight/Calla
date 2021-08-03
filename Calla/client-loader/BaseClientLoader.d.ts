import type { IFetcher } from "kudzu/io/IFetcher";
import type { progressCallback } from "kudzu/tasks/progressCallback";
import { AudioManager } from "../audio/AudioManager";
import { Calla } from "../Calla";
import type { IMetadataClientExt } from "../meta/IMetadataClient";
import type { ITeleconferenceClientExt } from "../tele/ITeleconferenceClient";
import type { IClientLoader } from "./IClientLoader";
export declare abstract class BaseClientLoader<TeleT extends ITeleconferenceClientExt> implements IClientLoader {
    load(): Promise<Calla>;
    load(onProgress: progressCallback): Promise<Calla>;
    load(audio: AudioManager): Promise<Calla>;
    load(audio: AudioManager, onProgress: progressCallback): Promise<Calla>;
    load(fetcher: IFetcher): Promise<Calla>;
    load(fetcher: IFetcher, onProgress: progressCallback): Promise<Calla>;
    load(fetcher: IFetcher, audio: AudioManager): Promise<Calla>;
    load(fetcher: IFetcher, audio: AudioManager, onProgress: progressCallback): Promise<Calla>;
    protected abstract onload(_fetcher: IFetcher, _onProgress?: progressCallback): Promise<void>;
    protected abstract createTeleconferenceClient(fetcher: IFetcher, audio: AudioManager): TeleT;
    protected abstract createMetadataClient(fetcher: IFetcher, audio: AudioManager, tele: TeleT): IMetadataClientExt;
}
