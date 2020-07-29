import { InterpolatedPose } from "../../positions/InterpolatedPose.js";
import { Destination } from "../../Destination.js";
import { BaseWebAudio } from "./BaseWebAudio.js";

/**
 * A spatializer that uses WebAudio's PannerNode
 **/
export class PannerBase extends BaseWebAudio {

    /**
     * Creates a new spatializer that uses WebAudio's PannerNode.
     * @param {string} id
     * @param {Destination} destination
     * @param {MediaStream|HTMLAudioElement} stream
     * @param {number} bufferSize
     */
    constructor(id, destination, stream, bufferSize) {
        const panner = destination.audioContext.createPanner();
        super(id, destination, stream, bufferSize, panner);

        this.inNode.panningModel = "HRTF";
        this.inNode.distanceModel = "inverse";
        this.inNode.coneInnerAngle = 360;
        this.inNode.coneOuterAngle = 0;
        this.inNode.coneOuterGain = 0;
    }

    /**
     * @param {InterpolatedPose} pose
     */
    update(pose) {
        super.update(pose);
        this.inNode.refDistance = this.destination.minDistance;
        this.inNode.rolloffFactor = this.destination.rolloff;
    }
}