import { BaseSpatializer } from "../BaseSpatializer";
import type { BaseNode } from "../nodes/BaseNode";
/**
 * Base class providing functionality for audio listeners.
 **/
export declare abstract class BaseListener extends BaseSpatializer {
    /**
     * Creates a spatializer that keeps track of position
     */
    constructor(audioContext: AudioContext, destination: AudioDestinationNode | MediaStreamAudioDestinationNode);
    /**
     * Creates a spatialzer for an audio source.
     */
    createSpatializer(id: string, source: AudioNode, spatialize: boolean, audioContext: AudioContext): BaseNode;
}
