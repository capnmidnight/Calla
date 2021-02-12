import { BaseAudioBufferSource } from "./BaseAudioBufferSource";
import { BaseEmitter } from "./spatializers/BaseEmitter";
export declare class AudioBufferSource extends BaseAudioBufferSource {
    isPlaying: boolean;
    constructor(id: string, audioContext: BaseAudioContext, source: AudioBufferSourceNode, spatializer: BaseEmitter);
    play(): Promise<void>;
    stop(): void;
    dispose(): void;
}
