import { BaseWebAudioSpatializer } from "./BaseWebAudioSpatializer.js";

/**
 * A spatializer that uses WebAudio's PannerNode
 **/
export class BasePannerSpatializer extends BaseWebAudioSpatializer {

    /**
     * Creates a new spatializer that uses WebAudio's PannerNode.
     * @param {string} userID
     * @param {Destination} destination
     * @param {MediaStream|HTMLAudioElement} stream
     * @param {number} bufferSize
     * @param {Function} createPosition
     */
    constructor(userID, destination, stream, bufferSize, createPosition) {
        const panner = destination.audioContext.createPanner(),
            position = createPosition(panner);
        super(userID, destination, stream, position, bufferSize, panner);

        this.inNode.panningModel = "HRTF";
        this.inNode.distanceModel = "inverse";
        this.inNode.coneInnerAngle = 360;
        this.inNode.coneOuterAngle = 0;
        this.inNode.coneOuterGain = 0;
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