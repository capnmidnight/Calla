import { BaseAnalyzedSpatializer } from "./BaseAnalyzedSpatializer.js";

export class BaseWebAudioSpatializer extends BaseAnalyzedSpatializer {

    /**
     * 
     * @param {string} userID
     * @param {Destination} destination
     * @param {HTMLAudioElement} audio
     * @param {BasePosition} position
     * @param {number} bufferSize
     * @param {PannerNode|StereoPannerNode} inNode
     * @param {GainNode=} outNode
     */
    constructor(userID, destination, audio, position, bufferSize, inNode, outNode) {
        super(userID, destination, audio, position, bufferSize, inNode);

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