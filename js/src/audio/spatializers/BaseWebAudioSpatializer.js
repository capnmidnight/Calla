import { BaseAnalyzedSpatializer } from "./BaseAnalyzedSpatializer.js";

/**
 * A spatializer that uses the WebAudio API.
 **/
export class BaseWebAudioSpatializer extends BaseAnalyzedSpatializer {

    /**
     * Creates a new spatializer that uses the WebAudio API
     * @param {string} userID
     * @param {Destination} destination
     * @param {MediaStream|HTMLAudioElement} stream
     * @param {BasePosition} position
     * @param {number} bufferSize
     * @param {PannerNode|StereoPannerNode} inNode
     * @param {GainNode=} outNode
     */
    constructor(userID, destination, stream, position, bufferSize, inNode, outNode) {
        super(userID, destination, stream, position, bufferSize, inNode);

        this.outNode = outNode || inNode;
        this.outNode.connect(this.destination.audioContext.destination);

        if (this.inNode !== this.outNode) {
            this.inNode.connect(this.outNode);
        }
    }

    /**
     * Discard values and make this instance useless.
     */
    dispose() {
        if (this.inNode !== this.outNode) {
            this.inNode.disconnect(this.outNode);
        }

        this.outNode.disconnect(this.destination.audioContext.destination);
        this.outNode = null;

        super.dispose();
    }
}