import type { Pose } from "../../positions/Pose";
import { BaseWebAudioPanner } from "./BaseWebAudioPanner";
/**
 * A positioner that uses the WebAudio API's old setPosition method.
 **/
export declare class WebAudioPannerOld extends BaseWebAudioPanner {
    /**
     * Creates a new positioner that uses the WebAudio API's old setPosition method.
     */
    constructor(id: string, source: AudioNode, audioContext: AudioContext, destination: AudioNode);
    /**
     * Performs the spatialization operation for the audio source's latest location.
     */
    update(loc: Pose, _t: number): void;
}
