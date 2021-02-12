import type { ResonanceAudio } from "../../../resonance-audio/resonance-audio";
import type { Source } from "../../../resonance-audio/source";
import type { Pose } from "../../positions/Pose";
import { BaseEmitter } from "./BaseEmitter";
/**
 * A spatializer that uses Google's Resonance Audio library.
 **/
export declare class ResonanceAudioNode extends BaseEmitter {
    resScene: ResonanceAudio;
    resNode: Source;
    /**
     * Creates a new spatializer that uses Google's Resonance Audio library.
     */
    constructor(audioContext: BaseAudioContext, destination: AudioNode, res: ResonanceAudio);
    protected createNew(): ResonanceAudioNode;
    /**
     * Performs the spatialization operation for the audio source's latest location.
     */
    update(loc: Pose, _t: number): void;
    /**
     * Sets parameters that alter spatialization.
     **/
    setAudioProperties(minDistance: number, maxDistance: number, rolloff: number, algorithm: DistanceModelType, transitionTime: number): void;
    /**
     * Discard values and make this instance useless.
     */
    dispose(): void;
}
