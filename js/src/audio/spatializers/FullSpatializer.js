import { BaseWebAudioSpatializer } from "./BaseWebAudioSpatializer.js";
import { WebAudioNodePosition } from "../positions/WebAudioNodePosition.js";

export class FullSpatializer extends BaseWebAudioSpatializer {

    /**
     *
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
        this.inNode.refDistance = destination.minDistance;
        this.inNode.rolloffFactor = destination.rolloff;
        this.inNode.coneInnerAngle = 360;
        this.inNode.coneOuterAngle = 0;
        this.inNode.coneOuterGain = 0;

        Object.seal(this);
    }

    setAudioProperties(minDistance, maxDistance, rolloff, transitionTime) {
        super.setAudioOutputDevice(minDistance, maxDistance, rolloff, transitionTime);
        this.inNode.refDistance = minDistance;
        this.inNode.rolloffFactor = rolloff;
    }
}