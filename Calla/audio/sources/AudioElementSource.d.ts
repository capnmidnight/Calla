import { BaseAudioSource } from "./BaseAudioSource";
import { IPlayableSource } from "./IPlayableSource";
import { BaseEmitter } from "./spatializers/BaseEmitter";
export declare class AudioElementSource extends BaseAudioSource<MediaElementAudioSourceNode> implements IPlayableSource {
    constructor(id: string, source: MediaElementAudioSourceNode, spatializer: BaseEmitter);
    isPlaying: boolean;
    play(): Promise<void>;
    stop(): void;
    private disposed3;
    dispose(): void;
}
