import type { IFetcher } from "kudzu/io/IFetcher";
import type { progressCallback } from "kudzu/tasks/progressCallback";
import type { AudioManager } from "../audio/AudioManager";
import type { Calla } from "../Calla";
export interface IClientLoader {
    load(): Promise<Calla>;
    load(onProgress: progressCallback): Promise<Calla>;
    load(audio: AudioManager): Promise<Calla>;
    load(audio: AudioManager, onProgress: progressCallback): Promise<Calla>;
    load(fetcher: IFetcher): Promise<Calla>;
    load(fetcher: IFetcher, onProgress: progressCallback): Promise<Calla>;
    load(fetcher: IFetcher, audio: AudioManager): Promise<Calla>;
    load(fetcher: IFetcher, audio: AudioManager, onProgress: progressCallback): Promise<Calla>;
}
