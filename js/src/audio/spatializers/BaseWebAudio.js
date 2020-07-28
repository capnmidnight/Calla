import { BaseAnalyzed } from "./BaseAnalyzed.js";

/**
 * A spatializer that uses the WebAudio API.
 **/
export class BaseWebAudio extends BaseAnalyzed {

    /**
     * Creates a new spatializer that uses the WebAudio API
     * @param {Destination} destination
     * @param {MediaStream|HTMLAudioElement} stream
     * @param {number} bufferSize
     * @param {PannerNode|StereoPannerNode} inNode
     * @param {GainNode=} outNode
     */
    constructor(destination, stream, bufferSize, inNode, outNode = null) {
        super(destination, stream, bufferSize, inNode);

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