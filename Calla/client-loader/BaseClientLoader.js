import { Fetcher } from "kudzu/io/Fetcher";
import { isDefined, isFunction } from "kudzu/typeChecks";
import { AudioManager } from "../audio/AudioManager";
import { Calla } from "../Calla";
export class BaseClientLoader {
    async load(fetcher, audio, onProgress) {
        let f = null;
        let a = null;
        let p = null;
        if (fetcher instanceof AudioManager) {
            a = fetcher;
        }
        else if (isFunction(fetcher)) {
            p = fetcher;
        }
        else if (isDefined(fetcher)) {
            f = fetcher;
        }
        else {
            f = new Fetcher();
        }
        if (audio instanceof AudioManager) {
            a = audio;
        }
        else if (isFunction(audio)) {
            p = audio;
        }
        else {
            a = new AudioManager(f);
        }
        if (isFunction(onProgress)) {
            p = onProgress;
        }
        await this.onload(f, p);
        const t = this.createTeleconferenceClient(f, a);
        const m = this.createMetadataClient(f, a, t);
        return Promise.resolve(new Calla(f, t, m));
    }
}
//# sourceMappingURL=BaseClientLoader.js.map