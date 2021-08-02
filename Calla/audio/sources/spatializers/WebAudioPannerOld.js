import { BaseWebAudioPanner } from "./BaseWebAudioPanner";
/**
 * A positioner that uses the WebAudio API's old setPosition method.
 **/
export class WebAudioPannerOld extends BaseWebAudioPanner {
    /**
     * Creates a new positioner that uses the WebAudio API's old setPosition method.
     */
    constructor(destination) {
        super(destination);
        Object.seal(this);
    }
    createNew() {
        return new WebAudioPannerOld(this.destination);
    }
    /**
     * Performs the spatialization operation for the audio source's latest location.
     */
    update(loc, _t) {
        const { p, f } = loc;
        this.panner.setPosition(p[0], p[1], p[2]);
        this.panner.setOrientation(f[0], f[1], f[2]);
    }
}
//# sourceMappingURL=WebAudioPannerOld.js.map