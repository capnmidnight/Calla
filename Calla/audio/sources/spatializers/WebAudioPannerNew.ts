import type { Pose } from "../../positions/Pose";
import { BaseWebAudioPanner } from "./BaseWebAudioPanner";

/**
 * A positioner that uses WebAudio's playback dependent time progression.
 **/
export class WebAudioPannerNew extends BaseWebAudioPanner {

    /**
     * Creates a new positioner that uses WebAudio's playback dependent time progression.
     */
    constructor(audioContext: BaseAudioContext, destination: AudioNode) {
        super(audioContext, destination);

        Object.seal(this);
    }

    protected createNew(): WebAudioPannerNew {
        return new WebAudioPannerNew(this.audioContext, this.destination);
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     */
    update(loc: Pose, t: number): void {
        const { p, f } = loc;
        this.panner.positionX.setValueAtTime(p[0], t);
        this.panner.positionY.setValueAtTime(p[1], t);
        this.panner.positionZ.setValueAtTime(p[2], t);
        this.panner.orientationX.setValueAtTime(-f[0], t);
        this.panner.orientationY.setValueAtTime(-f[1], t);
        this.panner.orientationZ.setValueAtTime(-f[2], t);
    }
}

