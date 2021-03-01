import { BaseSpatializer } from "../../BaseSpatializer";
import { BaseEmitter } from "../../sources/spatializers/BaseEmitter";
import { AudioDestination } from "../AudioDestination";
/**
 * Base class providing functionality for audio listeners.
 **/
export declare abstract class BaseListener extends BaseSpatializer {
    input: AudioNode;
    output: AudioNode;
    /**
     * Creates a spatializer that keeps track of position
     */
    constructor(audioContext: BaseAudioContext);
    /**
     * Creates a spatialzer for an audio source.
     */
    createSpatializer(spatialize: boolean, audioContext: BaseAudioContext, destination: AudioDestination): BaseEmitter;
}
