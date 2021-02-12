import { BaseAudioElement } from "../BaseAudioElement";
import { BaseEmitter } from "./spatializers/BaseEmitter";
export declare abstract class BaseAudioSource<T extends AudioNode> extends BaseAudioElement<BaseEmitter> {
    id: string;
    private _source;
    constructor(id: string, audioContext: BaseAudioContext);
    dispose(): void;
    get spatialized(): boolean;
    get source(): T;
    set source(v: T);
    protected disconnectSpatializer(): void;
    protected connectSpatializer(): void;
}
