import { BaseAudioBufferSource } from "./BaseAudioBufferSource";
import { BaseEmitter } from "./spatializers/BaseEmitter";
export declare class AudioBufferSource extends BaseAudioBufferSource {
    isPlaying: boolean;
    constructor(id: string, source: AudioBufferSourceNode, spatializer: BaseEmitter);
    play(): Promise<void>;
    stop(): void;
    private disposed3;
    dispose(): void;
}
