import { BaseSpatializer } from "../../BaseSpatializer";
import { NoSpatializationNode } from "../../sources/spatializers/NoSpatializationNode";
/**
 * Base class providing functionality for audio listeners.
 **/
export class BaseListener extends BaseSpatializer {
    input;
    output;
    /**
     * Creates a spatializer that keeps track of position
     */
    constructor() {
        super();
    }
    /**
     * Creates a spatialzer for an audio source.
     */
    createSpatializer(spatialize, _isRemoteStream, destination) {
        if (spatialize) {
            throw new Error("Can't spatialize with the base listener.");
        }
        return new NoSpatializationNode(destination.nonSpatializedInput);
    }
}
//# sourceMappingURL=BaseListener.js.map