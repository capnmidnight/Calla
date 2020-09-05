import { BaseAnalyzed } from "./BaseAnalyzed";

/**
 * A spatializer that uses the WebAudio API.
 **/
export class BaseWebAudio extends BaseAnalyzed {

    /**
     * Creates a new spatializer that uses the WebAudio API
     * @param {string} id
     * @param {MediaStream|HTMLAudioElement} stream
     * @param {number} bufferSize
     * @param {AudioContext} audioContext
     * @param {PannerNode|StereoPannerNode} inNode
     * @param {GainNode=} outNode
     */
    constructor(id, stream, bufferSize, audioContext, inNode, outNode = null) {
        super(id, stream, bufferSize, audioContext, inNode);

        this.outNode = outNode || inNode;
        this.outNode.connect(audioContext.destination);

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

        this.outNode.disconnect(this.outNode.context.destination);
        this.outNode = null;

        super.dispose();
    }
}