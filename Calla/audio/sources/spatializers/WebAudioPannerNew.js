import { BaseWebAudioPanner } from "./BaseWebAudioPanner";
/**
 * A positioner that uses WebAudio's playback dependent time progression.
 **/
export class WebAudioPannerNew extends BaseWebAudioPanner {
    /**
     * Creates a new positioner that uses WebAudio's playback dependent time progression.
     */
    constructor(destination) {
        super(destination);
        Object.seal(this);
    }
    createNew() {
        return new WebAudioPannerNew(this.destination);
    }
    /**
     * Performs the spatialization operation for the audio source's latest location.
     */
    update(loc, t) {
        const { p, f } = loc;
        this.panner.positionX.setValueAtTime(p[0], t);
        this.panner.positionY.setValueAtTime(p[1], t);
        this.panner.positionZ.setValueAtTime(p[2], t);
        this.panner.orientationX.setValueAtTime(-f[0], t);
        this.panner.orientationY.setValueAtTime(-f[1], t);
        this.panner.orientationZ.setValueAtTime(-f[2], t);
    }
}
//# sourceMappingURL=WebAudioPannerNew.js.map