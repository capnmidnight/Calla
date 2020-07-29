import { Pose } from "../../positions/Pose.js";
import { BaseWebAudio } from "./BaseWebAudio.js";
import { ManualBase } from "./ManualBase.js";

/**
 * A spatializer that performs stereo panning and volume scaling.
 **/
export class ManualStereo extends BaseWebAudio {

    /**
     * Creates a new spatializer that performs stereo panning and volume scaling.
     * @param {string} id
     * @param {MediaStream|HTMLAudioElement} stream
     * @param {number} bufferSize
     * @param {AudioContext} audioContext
     * @param {Pose} dest
     */
    constructor(id, stream, bufferSize, audioContext, dest) {
        super(id, stream, bufferSize,
            audioContext,
            audioContext.createStereoPanner(),
            audioContext.createGain());
        this.manual = new ManualBase(dest);

        Object.seal(this);
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     * @param {Pose} loc
     */
    update(loc) {
        super.update(loc);
        this.manual.update(loc);
        this.inNode.pan.value = this.manual.pan;
        this.outNode.gain.value = this.manual.volume;
    }
}

