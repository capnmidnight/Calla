import { WebAudioOldNodePosition } from "../positions/WebAudioOldNodePosition.js";
import { BasePannerSpatializer } from "./BasePannerSpatializer.js";

/**
 * A spatializer that uses WebAudio's PannerNode
 **/
export class OldPannerSpatializer extends BasePannerSpatializer {

    /**
     * Creates a new spatializer that uses WebAudio's PannerNode.
     * @param {string} userID
     * @param {Destination} destination
     * @param {HTMLAudioElement} audio
     * @param {number} bufferSize
     * @param {boolean} forceInterpolatedPosition
     */
    constructor(userID, destination, audio, bufferSize) {
        super(userID, destination, audio, position, bufferSize, panner => new WebAudioOldNodePosition(panner));
        Object.seal(this);
    }
}