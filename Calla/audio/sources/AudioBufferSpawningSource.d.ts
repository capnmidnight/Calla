import { BaseAudioBufferSource } from "./BaseAudioBufferSource";
import { BaseEmitter } from "./spatializers/BaseEmitter";
export declare class AudioBufferSpawningSource extends BaseAudioBufferSource {
    private counter;
    private playingSources;
    constructor(id: string, source: AudioBufferSourceNode, spatializer: BaseEmitter);
    protected connectSpatializer(): void;
    protected disconnectSpatializer(): void;
    get isPlaying(): boolean;
    play(): Promise<void>;
    stop(): void;
    private disposed3;
    dispose(): void;
}
