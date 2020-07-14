import { BaseWebAudioSpatializer } from "./BaseWebAudioSpatializer.js";
import { WebAudioNodePosition } from "../positions/WebAudioNodePosition.js";

/**
 * A spatializer that uses WebAudio's PannerNode
 **/
export class FullSpatializer extends BaseWebAudioSpatializer {

    /**
     * Creates a new spatializer that uses WebAudio's PannerNode.
     * @param {string} userID
     * @param {Destination} destination
     * @param {HTMLAudioElement} audio
     * @param {number} bufferSize
     * @param {boolean} forceInterpolatedPosition
     */
    constructor(userID, destination, audio, bufferSize, forceInterpolatedPosition) {
        const panner = destination.audioContext.createPanner(),
            position = new WebAudioNodePosition(panner, forceInterpolatedPosition);
        super(userID, destination, audio, position, bufferSize, panner);

        this.inNode.panningModel = "HRTF";
        this.inNode.distanceModel = "inverse";
        this.inNode.coneInnerAngle = 360;
        this.inNode.coneOuterAngle = 0;
        this.inNode.coneOuterGain = 0;

        Object.seal(this);
    }

    /**
     * Sets parameters that alter spatialization.
     * @param {number} minDistance
     * @param {number} maxDistance
     * @param {number} rolloff
     * @param {number} transitionTime
     */
    setAudioProperties(minDistance, maxDistance, rolloff, transitionTime) {
        super.setAudioProperties(minDistance, maxDistance, rolloff, transitionTime);
        this.inNode.refDistance = minDistance;
        this.inNode.rolloffFactor = rolloff;
    }
}