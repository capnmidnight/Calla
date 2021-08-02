import { Gain } from "kudzu/audio";
import { IDisposable } from "kudzu/using";
import { BaseSpatializer } from "./BaseSpatializer";
import { IPoseable } from "./IPoseable";
import { InterpolatedPose } from "./positions/InterpolatedPose";

export interface AudioElement
    extends IDisposable, IPoseable {
    spatializer: BaseSpatializer;
    volume: number;
    update(t: number): void;
}

export abstract class BaseAudioElement<T extends BaseSpatializer>
    implements AudioElement {
    pose = new InterpolatedPose();
    private _spatializer: T = null;
    protected volumeControl: GainNode;

    constructor(public id: string) {
        this.volumeControl = Gain("volume-control-" + this.id);
    }

    private disposed = false;
    dispose(): void {
        if (!this.disposed) {
            this.spatializer = null;
            this.disposed = true;
        }
    }

    abstract get spatialized(): boolean;

    get volume(): number {
        return this.volumeControl.gain.value;
    }

    set volume(v: number) {
        this.volumeControl.gain.value = v;
    }

    get spatializer(): T {
        return this._spatializer;
    }

    set spatializer(v: T) {
        if (this.spatializer !== v) {
            if (this._spatializer) {
                this.disconnectSpatializer();
                this._spatializer.dispose();
            }
            this._spatializer = v;
            if (this._spatializer) {
                this.connectSpatializer();
            }
        }
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

    protected abstract connectSpatializer(): void;
    protected abstract disconnectSpatializer(): void;
}
