import { disconnect } from "kudzu/audio";
import { BaseSpatializer } from "../../BaseSpatializer";
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
    constructor(destination) {
        super();
        this.destination = destination;
    }
    disposed = false;
    dispose() {
        if (!this.disposed) {
            if (this.output !== this.destination) {
                disconnect(this);
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