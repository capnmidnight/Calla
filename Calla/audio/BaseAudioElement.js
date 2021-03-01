import { InterpolatedPose } from "./positions/InterpolatedPose";
export class BaseAudioElement {
    constructor(audioContext) {
        this.audioContext = audioContext;
        this.pose = new InterpolatedPose();
        this._spatializer = null;
        this.disposed = false;
        this.volumeControl = audioContext.createGain();
    }
    dispose() {
        if (!this.disposed) {
            this.spatializer = null;
            this.disposed = true;
        }
    }
    get volume() {
        return this.volumeControl.gain.value;
    }
    set volume(v) {
        this.volumeControl.gain.value = v;
    }
    get spatializer() {
        return this._spatializer;
    }
    set spatializer(v) {
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
    update(t) {
        this.pose.update(t);
        if (this.spatializer) {
            this.spatializer.update(this.pose.current, t);
        }
    }
}
//# sourceMappingURL=BaseAudioElement.js.map