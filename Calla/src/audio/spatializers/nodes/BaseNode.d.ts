import { BaseSpatializer } from "../BaseSpatializer";
/**
 * Base class providing functionality for audio sources.
 **/
export declare abstract class BaseNode extends BaseSpatializer {
    id: string;
    source: AudioNode;
    private playingSources;
    /**
     * Creates a spatializer that keeps track of the relative position
     * of an audio element to the listener destination.
     * @param id
     * @param stream
     * @param audioContext - the output WebAudio context
     * @param node - this node out to which to pipe the stream
     */
    constructor(id: string, source: AudioNode, audioContext: AudioContext);
    /**
     * Discard values and make this instance useless.
     */
    dispose(): void;
    get isPlaying(): boolean;
    play(): Promise<void>;
    stop(): void;
}
