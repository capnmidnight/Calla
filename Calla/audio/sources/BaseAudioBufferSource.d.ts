import { BaseAudioSource } from "./BaseAudioSource";
import { IPlayableSource } from "./IPlayableSource";
import { BaseEmitter } from "./spatializers/BaseEmitter";
export declare abstract class BaseAudioBufferSource extends BaseAudioSource<AudioBufferSourceNode> implements IPlayableSource {
    constructor(id: string, audioContext: BaseAudioContext, source: AudioBufferSourceNode, spatializer: BaseEmitter);
    abstract get isPlaying(): boolean;
    abstract play(): Promise<void>;
    abstract stop(): void;
}
