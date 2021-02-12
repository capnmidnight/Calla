import { BaseSpatializer } from "../../BaseSpatializer";
/**
 * Base class providing functionality for audio listeners.
 **/
export declare abstract class BaseEmitter extends BaseSpatializer {
    input: AudioNode;
    output: AudioNode;
    protected destination: AudioNode;
    /**
     * Creates a spatializer that keeps track of position
     */
    constructor(audioContext: BaseAudioContext, input: AudioNode, output: AudioNode, destination: AudioNode);
    dispose(): void;
    protected copyAudioProperties(from: BaseEmitter): void;
    protected abstract createNew(): BaseEmitter;
    clone(): BaseEmitter;
}
