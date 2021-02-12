import type { Pose } from "../../positions/Pose";
import { BaseWebAudioPanner } from "./BaseWebAudioPanner";

/**
 * A positioner that uses the WebAudio API's old setPosition method.
 **/
export class WebAudioPannerOld extends BaseWebAudioPanner {

    /**
     * Creates a new positioner that uses the WebAudio API's old setPosition method.
     */
    constructor(audioContext: BaseAudioContext, destination: AudioNode) {
        super(audioContext, destination);

        Object.seal(this);
    }


    protected createNew(): WebAudioPannerOld {
        return new WebAudioPannerOld(this.audioContext, this.destination);
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     */
    update(loc: Pose, _t: number): void {
        const { p, f } = loc;
        this.panner.setPosition(p[0], p[1], p[2]);
        this.panner.setOrientation(f[0], f[1], f[2]);
    }
}
