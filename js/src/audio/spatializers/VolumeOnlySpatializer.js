import { BaseSpatializer } from "./BaseSpatializer.js";
import { InterpolatedPosition } from "../positions/InterpolatedPosition.js";

export class VolumeOnlySpatializer extends BaseSpatializer {

    /**
     *
     * @param {string} userID
     * @param {Destination} destination
     * @param {HTMLAudioElement} audio
     */
    constructor(userID, destination, audio) {
        super(userID, destination, audio, new InterpolatedPosition());
        this.audio.play();

        Object.seal(this);
    }

    update() {
        super.update();
        this.audio.volume = this.volume;
    }
}
