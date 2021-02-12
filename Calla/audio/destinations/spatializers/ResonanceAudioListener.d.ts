import type { Pose } from "../../positions/Pose";
import { BaseEmitter } from "../../sources/spatializers/BaseEmitter";
import { AudioDestination } from "../AudioDestination";
import { BaseListener } from "./BaseListener";
/**
 * An audio positioner that uses Google's Resonance Audio library
 **/
export declare class ResonanceAudioListener extends BaseListener {
    private scene;
    /**
     * Creates a new audio positioner that uses Google's Resonance Audio library
     */
    constructor(audioContext: AudioContext);
    dispose(): void;
    /**
     * Performs the spatialization operation for the audio source's latest location.
     */
    update(loc: Pose, _t: number): void;
    /**
     * Creates a spatialzer for an audio source.
     */
    createSpatializer(spatialize: boolean, audioContext: BaseAudioContext, destination: AudioDestination): BaseEmitter;
}
