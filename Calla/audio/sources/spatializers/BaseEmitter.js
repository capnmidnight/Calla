import { BaseSpatializer } from "../../BaseSpatializer";
import { connect, disconnect } from "../../GraphVisualizer";
/**
 * Base class providing functionality for audio listeners.
 **/
export class BaseEmitter extends BaseSpatializer {
    /**
     * Creates a spatializer that keeps track of position
     */
    constructor(audioContext, input, output, destination) {
        super(audioContext);
        this.input = input;
        this.output = output;
        this.destination = destination;
        if (this.output !== this.destination) {
            connect(this.output, this.destination);
        }
    }
    dispose() {
        if (this.output !== this.destination) {
            disconnect(this.output, this.destination);
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