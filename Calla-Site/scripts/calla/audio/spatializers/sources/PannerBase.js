import { BaseWebAudio } from "./BaseWebAudio";

/**
 * A spatializer that uses WebAudio's PannerNode
 **/
export class PannerBase extends BaseWebAudio {

    /**
     * Creates a new spatializer that uses WebAudio's PannerNode.
     * @param {string} id
     * @param {MediaStream|HTMLAudioElement} stream
     * @param {number} bufferSize
     * @param {AudioContext} audioContext
     */
    constructor(id, stream, bufferSize, audioContext) {
        const panner = audioContext.createPanner();
        super(id, stream, bufferSize, audioContext, panner);

        this.inNode.panningModel = "HRTF";
        this.inNode.distanceModel = "inverse";
        this.inNode.coneInnerAngle = 360;
        this.inNode.coneOuterAngle = 0;
        this.inNode.coneOuterGain = 0;
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     * @param {import("../../positions/Pose").Pose} loc
     */
    update(loc) {
        super.update(loc);
        this.inNode.refDistance = this.minDistance;
        this.inNode.rolloffFactor = this.rolloff;
    }
}