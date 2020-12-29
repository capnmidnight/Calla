import type { Pose } from "../../positions/Pose";
import { BaseWebAudioPanner } from "./BaseWebAudioPanner";

/**
 * A positioner that uses the WebAudio API's old setPosition method.
 **/
export class WebAudioPannerOld extends BaseWebAudioPanner {

    /**
     * Creates a new positioner that uses the WebAudio API's old setPosition method.
     */
    constructor(id: string, source: AudioNode, audioContext: AudioContext, destination: AudioNode) {
        super(id, source, audioContext, destination);

        Object.seal(this);
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     */
    update(loc: Pose, _t: number): void {
        const { p, f } = loc;
        this.node.setPosition(p[0], p[1], p[2]);
        this.node.setOrientation(f[0], f[1], f[2]);
    }
}
