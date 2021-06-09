import { BaseSpatializer } from "../../BaseSpatializer";
import { disconnect } from "../../GraphVisualizer";
/**
 * Base class providing functionality for audio listeners.
 **/
export class BaseEmitter extends BaseSpatializer {
    destination;
    input;
    output;
    /**
     * Creates a spatializer that keeps track of position
     */
    constructor(audioContext, destination) {
        super(audioContext);
        this.destination = destination;
    }
    disposed = false;
    dispose() {
        if (!this.disposed) {
            if (this.output !== this.destination) {
                disconnect(this.output, this.destination);
            }
            this.disposed = true;
        }
    }
    copyAudioProperties(from) {
        this.setAudioProperties(from.minDistance, from.maxDistance, from.rolloff, from.algorithm, from.transitionTime);
    }
    clone() {
        const emitter = this.createNew();
        emitter.copyAudioProperties(this);
        return emitter;
    }
}
//# sourceMappingURL=BaseEmitter.js.map