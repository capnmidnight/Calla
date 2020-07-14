import { BaseSpatializer } from "./BaseSpatializer.js";
import { InterpolatedPosition } from "../positions/InterpolatedPosition.js";

/**
 * A spatializer that only modifies volume.
 **/
export class VolumeOnlySpatializer extends BaseSpatializer {

    /**
     * Creates a new spatializer that only modifies volume.
     * @param {string} userID
     * @param {Destination} destination
     * @param {HTMLAudioElement} audio
     */
    constructor(userID, destination, audio) {
        super(userID, destination, audio, new InterpolatedPosition());
        this.audio.play();

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
