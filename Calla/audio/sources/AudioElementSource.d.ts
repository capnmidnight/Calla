import { BaseAudioSource } from "./BaseAudioSource";
import { IPlayableSource } from "./IPlayableSource";
import { BaseEmitter } from "./spatializers/BaseEmitter";
export declare class AudioElementSource extends BaseAudioSource<MediaElementAudioSourceNode> implements IPlayableSource {
    constructor(id: string, audioContext: BaseAudioContext, source: MediaElementAudioSourceNode, spatializer: BaseEmitter);
    isPlaying: boolean;
    play(): Promise<void>;
    stop(): void;
    dispose(): void;
}
