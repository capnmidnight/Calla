import { IDisposable } from "kudzu/using";
import type { Pose } from "./positions/Pose";
/**
 * Base class providing functionality for spatializers.
 */
export declare abstract class BaseSpatializer implements IDisposable {
    protected audioContext: BaseAudioContext;
    minDistance: number;
    maxDistance: number;
    protected rolloff: number;
    protected algorithm: string;
    protected transitionTime: number;
    constructor(audioContext: BaseAudioContext);
    dispose(): void;
    abstract get input(): AudioNode;
    abstract get output(): AudioNode;
    /**
     * Sets parameters that alter spatialization.
     **/
    setAudioProperties(minDistance: number, maxDistance: number, rolloff: number, algorithm: string, transitionTime: number): void;
    /**
     * Performs the spatialization operation for the audio source's latest location.
     */
    abstract update(loc: Pose, t: number): void;
}
