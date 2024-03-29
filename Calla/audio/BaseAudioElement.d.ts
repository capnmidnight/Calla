import { IDisposable } from "kudzu/using";
import { BaseSpatializer } from "./BaseSpatializer";
import { IPoseable } from "./IPoseable";
import { InterpolatedPose } from "./positions/InterpolatedPose";
export interface AudioElement extends IDisposable, IPoseable {
    spatializer: BaseSpatializer;
    volume: number;
    update(t: number): void;
}
export declare abstract class BaseAudioElement<T extends BaseSpatializer> implements AudioElement {
    id: string;
    pose: InterpolatedPose;
    private _spatializer;
    volumeControl: GainNode;
    constructor(id: string);
    private disposed;
    dispose(): void;
    abstract get spatialized(): boolean;
    get volume(): number;
    set volume(v: number);
    get spatializer(): T;
    set spatializer(v: T);
    /**
     * Update the user.
     * @param t - the current update time.
     */
    update(t: number): void;
    protected abstract connectSpatializer(): void;
    protected abstract disconnectSpatializer(): void;
}
