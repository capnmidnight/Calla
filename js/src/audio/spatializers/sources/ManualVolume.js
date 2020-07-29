import { Pose } from "../../positions/Pose.js";
import { BaseSource } from "./BaseSource.js";
import { ManualBase } from "./ManualBase.js";

/**
 * A spatializer that only modifies volume.
 **/
export class ManualVolume extends BaseSource {

    /**
     * Creates a new spatializer that only modifies volume.
     * @param {string} id
     * @param {MediaStream|HTMLAudioElement} stream
     * @param {Pose} dest
     */
    constructor(id, stream, dest) {
        super(id, stream);
        this.audio.muted = false;
        this.audio.play();
        this.manual = new ManualBase(dest);

        /** @type {number} */
        this._lastVolume = null;

        Object.seal(this);
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     * @param {Pose} loc
     */
    update(loc) {
        super.update(loc);
        this.manual.update(loc);
        if (this._lastVolume !== this.manual.volume) {
            this._lastVolume
                = this.audio.volume
                = this.manual.volume;
        }
    }
}
