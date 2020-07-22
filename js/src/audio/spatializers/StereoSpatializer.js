import { BaseWebAudioSpatializer } from "./BaseWebAudioSpatializer.js";
import { InterpolatedPosition } from "../positions/InterpolatedPosition.js";

/**
 * A spatializer that performs stereo panning and volume scaling.
 **/
export class StereoSpatializer extends BaseWebAudioSpatializer {

    /**
     * Creates a new spatializer that performs stereo panning and volume scaling.
     * @param {string} userID
     * @param {Destination} destination
     * @param {MediaStream|HTMLAudioElement} stream
     * @param {number} bufferSize
     */
    constructor(userID, destination, stream, bufferSize) {
        super(userID, destination, stream, new InterpolatedPosition(), bufferSize,
            destination.audioContext.createStereoPanner(),
            destination.audioContext.createGain());

        Object.seal(this);
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     **/
    update() {
        super.update();
        this.inNode.pan.value = this.pan;
        this.outNode.gain.value = this.volume;
    }
}

