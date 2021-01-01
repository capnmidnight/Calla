import type { IDisposable } from "kudzu/using";
import type { Pose } from "../positions/Pose";

/**
 * Base class providing functionality for spatializers.
 */
export abstract class BaseSpatializer implements IDisposable {
    gain: GainNode = null;

    minDistance = 1;
    maxDistance = 10;
    protected rolloff = 1;
    protected algorithm = "logarithmic";
    protected transitionTime = 0.1;

    constructor(protected audioContext: AudioContext) {
        this.gain = audioContext.createGain();
    }

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
     * Discard values and make this instance useless.
     */
    dispose(): void {
        if (this.gain) {
            this.gain.disconnect();
            this.gain = null;
        }
    }

    get volume(): number {
        return this.gain.gain.value;
    }

    set volume(v: number) {
        this.gain.gain.value = v;
    }

    play(): Promise<void> {
        return Promise.resolve();
    }

    stop(): void {
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     */
    abstract update(loc: Pose, t: number): void;
}

