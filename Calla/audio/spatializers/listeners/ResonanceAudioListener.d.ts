import type { Pose } from "../../positions/Pose";
import type { BaseNode } from "../nodes/BaseNode";
import { BaseListener } from "./BaseListener";
/**
 * An audio positioner that uses Google's Resonance Audio library
 **/
export declare class ResonanceAudioListener extends BaseListener {
    private scene;
    /**
     * Creates a new audio positioner that uses Google's Resonance Audio library
     */
    constructor(audioContext: AudioContext, destination: AudioDestinationNode | MediaStreamAudioDestinationNode);
    /**
     * Performs the spatialization operation for the audio source's latest location.
     */
    update(loc: Pose, _t: number): void;
    /**
     * Creates a spatialzer for an audio source.
     */
    createSpatializer(id: string, source: AudioNode, spatialize: boolean, audioContext: AudioContext): BaseNode;
}
