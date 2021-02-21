import { Fetcher } from "kudzu/io/Fetcher";
import type { IFetcher } from "kudzu/io/IFetcher";
import type { progressCallback } from "kudzu/tasks/progressCallback";
import { isDefined, isFunction } from "kudzu/typeChecks";
import { AudioManager } from "../audio/AudioManager";
import { Calla } from "../Calla";
import type { IMetadataClientExt } from "../meta/IMetadataClient";
import type { ITeleconferenceClientExt } from "../tele/ITeleconferenceClient";
import type { IClientLoader } from "./IClientLoader";

export abstract class BaseClientLoader<TeleT extends ITeleconferenceClientExt, MetaT extends IMetadataClientExt> implements IClientLoader {
    async load(fetcher?: IFetcher | AudioManager | progressCallback, audio?: AudioManager | progressCallback, onProgress?: progressCallback): Promise<Calla> {
        let f: IFetcher = null;
        let a: AudioManager = null;
        let p: progressCallback = null;

        if (isDefined(fetcher)
            && !(fetcher instanceof AudioManager)
            && !isFunction(fetcher)) {
            f = fetcher;
        }
        else {
            f = new Fetcher();
        }

        if (fetcher instanceof AudioManager) {
            a = fetcher;
        }
        else if (isDefined(audio)
            && !isFunction(audio)) {
            a = audio;
        }
        else {
            a = new AudioManager(f);
        }

        if (isFunction(fetcher)) {
            p = fetcher;
        }
        else if (isFunction(audio)) {
            p = audio;
        }
        else if (isFunction(onProgress)) {
            p = onProgress;
        }

        await this._load(f, p);
        const t = this.createTeleconferenceClient(f, a);
        const m = this.createMetadataClient(f, a, t);
        return Promise.resolve(new Calla(f, t, m));
    }

    protected abstract _load(fetcher: IFetcher, onProgress?: progressCallback): Promise<void>;
    protected abstract createTeleconferenceClient(fetcher: IFetcher, audio: AudioManager): TeleT;
    protected abstract createMetadataClient(fetcher: IFetcher, audio: AudioManager, tele: TeleT): MetaT;
}
