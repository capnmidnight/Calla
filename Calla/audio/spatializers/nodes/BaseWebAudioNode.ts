import { BaseNode } from "./BaseNode";


export abstract class BaseWebAudioNode<T extends AudioNode> extends BaseNode {
    /**
     * Creates a spatializer that keeps track of the relative position
     * of an audio element to the listener destination.
     * @param id
     * @param stream
     * @param audioContext - the output WebAudio context
     * @param node - this node out to which to pipe the stream
     */
    constructor(id: string, source: AudioNode, audioContext: AudioContext, public node: T) {
        super(id, source, audioContext);

        this.gain.connect(this.node);
    }

    /**
     * Discard values and make this instance useless.
     */
    dispose(): void {
        if (this.node) {
            this.node.disconnect();
            this.node = null;
        }

        super.dispose();
    }

}
