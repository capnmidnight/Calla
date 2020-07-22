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
     * @param {MediaStream|HTMLAudioElement} stream
     * @param {number} bufferSize
     * @param {boolean} forceInterpolatedPosition
     */
    constructor(userID, destination, stream, bufferSize) {
        super(userID, destination, stream, position, bufferSize, panner => new WebAudioOldNodePosition(panner));
        Object.seal(this);
    }
}