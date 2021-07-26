import type { Pose } from "../../positions/Pose";
import { BaseEmitter } from "../../sources/spatializers/BaseEmitter";
import { AudioDestination } from "../AudioDestination";
import { BaseWebAudioListener } from "./BaseWebAudioListener";
/**
 * A positioner that uses WebAudio's playback dependent time progression.
 **/
export declare class WebAudioListenerNew extends BaseWebAudioListener {
    /**
     * Creates a new positioner that uses WebAudio's playback dependent time progression.
     */
    constructor(audioContext: BaseAudioContext);
    /**
     * Performs the spatialization operation for the audio source's latest location.
     */
    update(loc: Pose, t: number): void;
    /**
     * Creates a spatialzer for an audio source.
     */
    createSpatializer(spatialize: boolean, isRemoteStream: boolean, audioContext: BaseAudioContext, destination: AudioDestination): BaseEmitter;
}
