import { BaseSource } from "./BaseSource";

export class BaseRoutedSource extends BaseSource {

    /**
     * @param {string} id
     * @param {MediaStream|HTMLAudioElement} stream
     * @param {AudioContext} audioContext
     * @param {AudioNode} inNode
     */
    constructor(id, stream, audioContext, inNode) {
        super(id, stream, audioContext, inNode);

        /** @type {AudioNode} */
        this.inNode = inNode;
        this.inNode.connect(audioContext.destination);
    }

    /**
     * Discard values and make this instance useless.
     */
    dispose() {
        if (this.inNode) {
            this.inNode.disconnect();
            this.inNode = null;
        }

        super.dispose();
    }
}