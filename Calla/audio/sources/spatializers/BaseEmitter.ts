import { disconnect } from "kudzu/audio";
import { BaseSpatializer } from "../../BaseSpatializer";

/**
 * Base class providing functionality for audio listeners.
 **/
export abstract class BaseEmitter
    extends BaseSpatializer {

    input: AudioNode;
    output: AudioNode;

    /**
     * Creates a spatializer that keeps track of position
     */
    constructor(protected destination: AudioNode) {
        super();
    }

    private disposed = false;
    dispose(): void {
        if (!this.disposed) {
            if (this.output !== this.destination) {
                disconnect(this);
            }
            this.disposed = true;
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

