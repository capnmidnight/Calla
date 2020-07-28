import { InterpolatedPose } from "../positions/InterpolatedPose.js";
import { BaseSource } from "./BaseSource.js";
import { ManualBase } from "./ManualBase.js";

/**
 * A spatializer that only modifies volume.
 **/
export class ManualVolume extends BaseSource {

    /**
     * Creates a new spatializer that only modifies volume.
     * @param {Destination} destination
     * @param {MediaStream|HTMLAudioElement} stream
     */
    constructor(destination, stream) {
        super(destination, stream);
        this.audio.muted = false;
        this.manual = new ManualBase(id, destination);
        Object.seal(this);
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     * @param {InterpolatedPose} pose
     **/
    update(pose) {
        super.update(pose);
        this.manual.update(pose);
        this.audio.volume = this.manual.volume;
    }
}
