import { InterpolatedPosition } from "../positions/InterpolatedPosition.js";
import { BaseSpatializer } from "./BaseSpatializer.js";

/**
 * A spatializer that only modifies volume.
 **/
export class VolumeOnlySpatializer extends BaseSpatializer {

    /**
     * Creates a new spatializer that only modifies volume.
     * @param {string} userID
     * @param {Destination} destination
     * @param {MediaStream|HTMLAudioElement} stream
     */
    constructor(userID, destination, stream) {
        super(userID, destination, stream, new InterpolatedPosition());
        this.audio.muted = false;
        Object.seal(this);
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     **/
    update() {
        super.update();
        this.audio.volume = this.volume;
    }
}
