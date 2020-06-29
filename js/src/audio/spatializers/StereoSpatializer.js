import { BaseWebAudioSpatializer } from "./BaseWebAudioSpatializer.js";
import { InterpolatedPosition } from "../positions/InterpolatedPosition.js";

export class StereoSpatializer extends BaseWebAudioSpatializer {

    /**
     *
     * @param {string} userID
     * @param {Destination} destination
     * @param {HTMLAudioElement} audio
     * @param {number} bufferSize
     */
    constructor(userID, destination, audio, bufferSize) {
        super(userID, destination, audio, new InterpolatedPosition(), bufferSize,
            destination.audioContext.createStereoPanner(),
            destination.audioContext.createGain());

        Object.seal(this);
    }

    update() {
        super.update();
        this.inNode.pan.value = this.pan;
        this.outNode.gain.value = this.volume;
    }
}

