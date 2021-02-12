import { IDisposable } from "kudzu/using";
import type { Pose } from "./positions/Pose";

/**
 * Base class providing functionality for spatializers.
 */
export abstract class BaseSpatializer implements IDisposable {

    minDistance = 1;
    maxDistance = 10;
    protected rolloff = 1;
    protected algorithm = "logarithmic";
    protected transitionTime = 0.1;

    constructor(protected audioContext: BaseAudioContext) {
    }

    dispose(): void {
        // nothing to do in the base case
    }

    abstract get input(): AudioNode;
    abstract get output(): AudioNode;

    /**
     * Sets parameters that alter spatialization.
     **/
    setAudioProperties(minDistance: number, maxDistance: number, rolloff: number, algorithm: string, transitionTime: number): void {
        this.minDistance = minDistance;
        this.maxDistance = maxDistance;
        this.rolloff = rolloff;
        this.algorithm = algorithm;
        this.transitionTime = transitionTime;
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     */
    abstract update(loc: Pose, t: number): void;
}

