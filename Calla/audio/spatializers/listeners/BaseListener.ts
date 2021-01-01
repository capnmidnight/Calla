import { BaseSpatializer } from "../BaseSpatializer";
import type { BaseNode } from "../nodes/BaseNode";
import { NoSpatializationNode } from "../nodes/NoSpatializationNode";

/**
 * Base class providing functionality for audio listeners.
 **/
export abstract class BaseListener extends BaseSpatializer {
    /**
     * Creates a spatializer that keeps track of position
     */
    constructor(audioContext: AudioContext, destination: AudioDestinationNode | MediaStreamAudioDestinationNode) {
        super(audioContext);
        this.gain.connect(destination);
    }

    /**
     * Creates a spatialzer for an audio source.
     */
    createSpatializer(id: string, source: AudioNode, spatialize: boolean, audioContext: AudioContext): BaseNode {
        if (spatialize) {
            throw new Error("Can't spatialize with the base listener.");
        }

        return new NoSpatializationNode(id, source, audioContext, this.gain);
    }
}

