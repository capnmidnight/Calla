import { InterpolatedPose } from "./positions/InterpolatedPose";
export class AudioSource {
    constructor(id) {
        this.id = id;
        this.pose = new InterpolatedPose();
        this.streams = new Map();
        this._spatializer = null;
    }
    get spatializer() {
        return this._spatializer;
    }
    set spatializer(v) {
        if (this.spatializer !== v) {
            if (this._spatializer) {
                this._spatializer.dispose();
            }
            this._spatializer = v;
        }
    }
    dispose() {
        this.spatializer = null;
    }
    /**
     * Update the user.
     * @param t - the current update time.
     */
    update(t) {
        this.pose.update(t);
        if (this.spatializer) {
            this.spatializer.update(this.pose.current, t);
        }
    }
}
//# sourceMappingURL=AudioSource.js.map