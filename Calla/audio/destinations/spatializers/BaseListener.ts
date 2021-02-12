import { BaseSpatializer } from "../../BaseSpatializer";
import { BaseEmitter } from "../../sources/spatializers/BaseEmitter";
import { NoSpatializationNode } from "../../sources/spatializers/NoSpatializationNode";
import { AudioDestination } from "../AudioDestination";

/**
 * Base class providing functionality for audio listeners.
 **/
export abstract class BaseListener extends BaseSpatializer {
    /**
     * Creates a spatializer that keeps track of position
     */
    constructor(audioContext: BaseAudioContext, public input: AudioNode, public output: AudioNode) {
        super(audioContext);
    }

    /**
     * Creates a spatialzer for an audio source.
     */
    createSpatializer(spatialize: boolean, audioContext: BaseAudioContext, destination: AudioDestination): BaseEmitter {
        if (spatialize) {
            throw new Error("Can't spatialize with the base listener.");
        }

        return new NoSpatializationNode(audioContext, destination.nonSpatializedInput);
    }
}

