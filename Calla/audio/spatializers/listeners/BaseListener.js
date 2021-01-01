import { BaseSpatializer } from "../BaseSpatializer";
import { NoSpatializationNode } from "../nodes/NoSpatializationNode";
/**
 * Base class providing functionality for audio listeners.
 **/
export class BaseListener extends BaseSpatializer {
    /**
     * Creates a spatializer that keeps track of position
     */
    constructor(audioContext, destination) {
        super(audioContext);
        this.gain.connect(destination);
    }
    /**
     * Creates a spatialzer for an audio source.
     */
    createSpatializer(id, source, spatialize, audioContext) {
        if (spatialize) {
            throw new Error("Can't spatialize with the base listener.");
        }
        return new NoSpatializationNode(id, source, audioContext, this.gain);
    }
}
//# sourceMappingURL=BaseListener.js.map