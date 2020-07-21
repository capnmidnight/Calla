import { WebAudioNewNodePosition } from "../positions/WebAudioNewNodePosition.js";
import { BasePannerSpatializer } from "./BasePannerSpatializer.js";

/**
 * A spatializer that uses WebAudio's PannerNode
 **/
export class NewPannerSpatializer extends BasePannerSpatializer {

    /**
     * Creates a new spatializer that uses WebAudio's PannerNode.
     * @param {string} userID
     * @param {Destination} destination
     * @param {HTMLAudioElement} audio
     * @param {number} bufferSize
     * @param {boolean} forceInterpolatedPosition
     */
    constructor(userID, destination, audio, bufferSize, forceInterpolatedPosition) {
        super(userID, destination, audio, position, bufferSize, panner => new WebAudioNewNodePosition(panner, forceInterpolatedPosition));
        Object.seal(this);
    }
}