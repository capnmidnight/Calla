import type { IDisposable } from "kudzu";
import type { StreamType } from "../CallaEvents";
import { InterpolatedPose } from "./positions/InterpolatedPose";
import type { BaseSpatializer } from "./spatializers/BaseSpatializer";
export declare class AudioSource implements IDisposable {
    id: string;
    pose: InterpolatedPose;
    streams: Map<StreamType, MediaStream>;
    private _spatializer;
    constructor(id: string);
    get spatializer(): BaseSpatializer;
    set spatializer(v: BaseSpatializer);
    dispose(): void;
    /**
     * Update the user.
     * @param t - the current update time.
     */
    update(t: number): void;
}
