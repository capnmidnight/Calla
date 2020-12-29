import { WebAudioPannerOld } from "../nodes/WebAudioPannerOld";
import { BaseWebAudioListener } from "./BaseWebAudioListener";
/**
 * A positioner that uses WebAudio's playback dependent time progression.
 **/
export class WebAudioListenerOld extends BaseWebAudioListener {
    /**
     * Creates a new positioner that uses WebAudio's playback dependent time progression.
     */
    constructor(audioContext, destination) {
        super(audioContext, destination);
        Object.seal(this);
    }
    /**
     * Performs the spatialization operation for the audio source's latest location.
     */
    update(loc, _t) {
        const { p, f, u } = loc;
        this.node.setPosition(p[0], p[1], p[2]);
        this.node.setOrientation(f[0], f[1], f[2], u[0], u[1], u[2]);
    }
    /**
     * Creates a spatialzer for an audio source.
     */
    createSpatializer(id, source, spatialize, audioContext) {
        if (spatialize) {
            return new WebAudioPannerOld(id, source, audioContext, this.gain);
        }
        else {
            return super.createSpatializer(id, source, spatialize, audioContext);
        }
    }
}
//# sourceMappingURL=WebAudioListenerOld.js.map