import { BaseSpatializer } from "../../BaseSpatializer";
import { connect, disconnect } from "../../GraphVisualizer";

/**
 * Base class providing functionality for audio listeners.
 **/
export abstract class BaseEmitter
    extends BaseSpatializer {

    /**
     * Creates a spatializer that keeps track of position
     */
    constructor(audioContext: BaseAudioContext, public input: AudioNode, public output: AudioNode, protected destination: AudioNode) {
        super(audioContext);

        if (this.output !== this.destination) {
            connect(this.output, this.destination);
        }
    }

    dispose() {
        if (this.output !== this.destination) {
            disconnect(this.output, this.destination);
        }
    }

    protected copyAudioProperties(from: BaseEmitter) {
        this.setAudioProperties(
            from.minDistance,
            from.maxDistance,
            from.rolloff,
            from.algorithm,
            from.transitionTime);
    }

    protected abstract createNew(): BaseEmitter;

    clone(): BaseEmitter {
        const emitter = this.createNew();
        emitter.copyAudioProperties(this);
        return emitter;
    }
}

