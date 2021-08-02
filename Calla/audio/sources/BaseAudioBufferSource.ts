import { BaseAudioSource } from "./BaseAudioSource";
import { IPlayableSource } from "./IPlayableSource";
import { BaseEmitter } from "./spatializers/BaseEmitter";

export abstract class BaseAudioBufferSource
    extends BaseAudioSource<AudioBufferSourceNode>
    implements IPlayableSource {

    constructor(id: string, source: AudioBufferSourceNode, spatializer: BaseEmitter) {
        super(id);

        this.source = source;
        this.spatializer = spatializer;
    }

    abstract get isPlaying(): boolean;
    abstract play(): Promise<void>;
    abstract stop(): void;
}
