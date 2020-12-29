import { BaseNode } from "./BaseNode";
export class BaseWebAudioNode extends BaseNode {
    /**
     * Creates a spatializer that keeps track of the relative position
     * of an audio element to the listener destination.
     * @param id
     * @param stream
     * @param audioContext - the output WebAudio context
     * @param node - this node out to which to pipe the stream
     */
    constructor(id, source, audioContext, node) {
        super(id, source, audioContext);
        this.node = node;
        this.gain.connect(this.node);
    }
    /**
     * Discard values and make this instance useless.
     */
    dispose() {
        if (this.node) {
            this.node.disconnect();
            this.node = null;
        }
        super.dispose();
    }
}
//# sourceMappingURL=BaseWebAudioNode.js.map