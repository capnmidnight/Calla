import { BaseSpatializer } from "../../BaseSpatializer";
import { BaseEmitter } from "../../sources/spatializers/BaseEmitter";
import { NoSpatializationNode } from "../../sources/spatializers/NoSpatializationNode";
import { AudioDestination } from "../AudioDestination";

/**
 * Base class providing functionality for audio listeners.
 **/
export abstract class BaseListener extends BaseSpatializer {

    input: AudioNode;
    output: AudioNode;

    /**
     * Creates a spatializer that keeps track of position
     */
    constructor() {
        super();
    }

    /**
     * Creates a spatialzer for an audio source.
     */
    createSpatializer(spatialize: boolean, _isRemoteStream: boolean, destination: AudioDestination): BaseEmitter {
        if (spatialize) {
            throw new Error("Can't spatialize with the base listener.");
        }

        return new NoSpatializationNode(destination.nonSpatializedInput);
    }
}

