import { BaseNode } from "./BaseNode";
export declare abstract class BaseWebAudioNode<T extends AudioNode> extends BaseNode {
    node: T;
    /**
     * Creates a spatializer that keeps track of the relative position
     * of an audio element to the listener destination.
     * @param id
     * @param stream
     * @param audioContext - the output WebAudio context
     * @param node - this node out to which to pipe the stream
     */
    constructor(id: string, source: AudioNode, audioContext: AudioContext, node: T);
    /**
     * Discard values and make this instance useless.
     */
    dispose(): void;
}
