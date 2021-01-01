import type { IDisposable } from "kudzu/using";
import type { Pose } from "../positions/Pose";
/**
 * Base class providing functionality for spatializers.
 */
export declare abstract class BaseSpatializer implements IDisposable {
    protected audioContext: AudioContext;
    gain: GainNode;
    minDistance: number;
    maxDistance: number;
    protected rolloff: number;
    protected algorithm: string;
    protected transitionTime: number;
    constructor(audioContext: AudioContext);
    /**
     * Sets parameters that alter spatialization.
     **/
    setAudioProperties(minDistance: number, maxDistance: number, rolloff: number, algorithm: string, transitionTime: number): void;
    /**
     * Discard values and make this instance useless.
     */
    dispose(): void;
    get volume(): number;
    set volume(v: number);
    play(): Promise<void>;
    stop(): void;
    /**
     * Performs the spatialization operation for the audio source's latest location.
     */
    abstract update(loc: Pose, t: number): void;
}
