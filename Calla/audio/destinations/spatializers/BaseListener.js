import { BaseSpatializer } from "../../BaseSpatializer";
import { NoSpatializationNode } from "../../sources/spatializers/NoSpatializationNode";
/**
 * Base class providing functionality for audio listeners.
 **/
export class BaseListener extends BaseSpatializer {
    /**
     * Creates a spatializer that keeps track of position
     */
    constructor(audioContext, input, output) {
        super(audioContext);
        this.input = input;
        this.output = output;
    }
    /**
     * Creates a spatialzer for an audio source.
     */
    createSpatializer(spatialize, audioContext, destination) {
        if (spatialize) {
            throw new Error("Can't spatialize with the base listener.");
        }
        return new NoSpatializationNode(audioContext, destination.nonSpatializedInput);
    }
}
//# sourceMappingURL=BaseListener.js.map