import type { IDisposable } from "kudzu/using";
import type { StreamType } from "../CallaEvents";
import { InterpolatedPose } from "./positions/InterpolatedPose";
import type { BaseSpatializer } from "./spatializers/BaseSpatializer";

export class AudioSource implements IDisposable {
    pose = new InterpolatedPose();
    streams = new Map<StreamType, MediaStream>();
    private _spatializer: BaseSpatializer = null;

    constructor(public id: string) {
    }

    get spatializer(): BaseSpatializer {
        return this._spatializer;
    }

    set spatializer(v: BaseSpatializer) {
        if (this.spatializer !== v) {
            if (this._spatializer) {
                this._spatializer.dispose();
            }
            this._spatializer = v;
        }
    }

    dispose(): void {
        this.spatializer = null;
    }

    /**
     * Update the user.
     * @param t - the current update time.
     */
    update(t: number): void {
        this.pose.update(t);
        if (this.spatializer) {
            this.spatializer.update(this.pose.current, t);
        }
    }
}