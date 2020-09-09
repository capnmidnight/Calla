import { BaseSource } from "./BaseSource";

export class BaseRoutedSource extends BaseSource {

    /**
     * @param {string} id
     * @param {MediaStream|HTMLAudioElement} stream
     * @param {AudioContext} audioContext
     * @param {AudioNode} inNode
     */
    constructor(id, stream, audioContext, inNode) {
        super(id, stream, audioContext, (source) => {
            source.connect(inNode);
        });

        /** @type {AudioNode} */
        this.inNode = inNode;
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