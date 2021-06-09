import { InterpolatedPose } from "./positions/InterpolatedPose";
export class BaseAudioElement {
    audioContext;
    pose = new InterpolatedPose();
    _spatializer = null;
    volumeControl;
    constructor(audioContext) {
        this.audioContext = audioContext;
        this.volumeControl = audioContext.createGain();
    }
    disposed = false;
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