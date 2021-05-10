import type { IFetcher } from "kudzu/io/IFetcher";
import type { progressCallback } from "kudzu/tasks/progressCallback";
import { AudioManager } from "../audio/AudioManager";
import { Calla } from "../Calla";
import type { IMetadataClientExt } from "../meta/IMetadataClient";
import type { ITeleconferenceClientExt } from "../tele/ITeleconferenceClient";
import type { IClientLoader } from "./IClientLoader";
export declare abstract class BaseClientLoader<TeleT extends ITeleconferenceClientExt> implements IClientLoader {
    load(fetcher?: IFetcher | AudioManager | progressCallback, audio?: AudioManager | progressCallback, onProgress?: progressCallback): Promise<Calla>;
    protected abstract _load(fetcher: IFetcher, onProgress?: progressCallback): Promise<void>;
    protected abstract createTeleconferenceClient(fetcher: IFetcher, audio: AudioManager): TeleT;
    protected abstract createMetadataClient(fetcher: IFetcher, audio: AudioManager, tele: TeleT): IMetadataClientExt;
}
