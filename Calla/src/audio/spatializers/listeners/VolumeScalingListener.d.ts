import type { Pose } from "../../positions/Pose";
import type { BaseNode } from "../nodes/BaseNode";
import { BaseListener } from "./BaseListener";
/**
 * A positioner that uses WebAudio's gain nodes to only adjust volume.
 **/
export declare class VolumeScalingListener extends BaseListener {
    pose: Pose;
    /**
     * Creates a new positioner that uses WebAudio's playback dependent time progression.
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
