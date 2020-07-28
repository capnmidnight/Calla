import { InterpolatedPose } from "../positions/InterpolatedPose.js";
import { BaseWebAudio } from "./BaseWebAudio.js";
import { ManualBase } from "./ManualBase.js";

/**
 * A spatializer that performs stereo panning and volume scaling.
 **/
export class ManualStereo extends BaseWebAudio {

    /**
     * Creates a new spatializer that performs stereo panning and volume scaling.
     * @param {Destination} destination
     * @param {MediaStream|HTMLAudioElement} stream
     * @param {number} bufferSize
     */
    constructor(destination, stream, bufferSize) {
        super(destination, stream, bufferSize,
            destination.audioContext.createStereoPanner(),
            destination.audioContext.createGain());
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
        this.inNode.pan.value = this.manual.pan;
        this.outNode.gain.value = this.manual.volume;
    }
}

