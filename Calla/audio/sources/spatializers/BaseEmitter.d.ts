import { BaseSpatializer } from "../../BaseSpatializer";
/**
 * Base class providing functionality for audio listeners.
 **/
export declare abstract class BaseEmitter extends BaseSpatializer {
    protected destination: AudioNode;
    input: AudioNode;
    output: AudioNode;
    /**
     * Creates a spatializer that keeps track of position
     */
    constructor(destination: AudioNode);
    private disposed;
    dispose(): void;
    protected copyAudioProperties(from: BaseEmitter): void;
    protected abstract createNew(): BaseEmitter;
    clone(): BaseEmitter;
}
