import { BaseAudioSource } from "./BaseAudioSource";
import { IPlayableSource } from "./IPlayableSource";
import { BaseEmitter } from "./spatializers/BaseEmitter";

export abstract class BaseAudioBufferSource
    extends BaseAudioSource<AudioBufferSourceNode>
    implements IPlayableSource {

    constructor(id: string, audioContext: BaseAudioContext, source: AudioBufferSourceNode, spatializer: BaseEmitter) {
        super(id, audioContext);

        this.source = source;
        this.spatializer = spatializer;
    }

    abstract get isPlaying(): boolean;
    abstract play(): Promise<void>;
    abstract stop(): void;
}
