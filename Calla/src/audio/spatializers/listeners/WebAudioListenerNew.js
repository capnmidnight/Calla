import { WebAudioPannerNew } from "../nodes/WebAudioPannerNew";
import { BaseWebAudioListener } from "./BaseWebAudioListener";
/**
 * A positioner that uses WebAudio's playback dependent time progression.
 **/
export class WebAudioListenerNew extends BaseWebAudioListener {
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
    update(loc, t) {
        const { p, f, u } = loc;
        this.node.positionX.setValueAtTime(p[0], t);
        this.node.positionY.setValueAtTime(p[1], t);
        this.node.positionZ.setValueAtTime(p[2], t);
        this.node.forwardX.setValueAtTime(f[0], t);
        this.node.forwardY.setValueAtTime(f[1], t);
        this.node.forwardZ.setValueAtTime(f[2], t);
        this.node.upX.setValueAtTime(u[0], t);
        this.node.upY.setValueAtTime(u[1], t);
        this.node.upZ.setValueAtTime(u[2], t);
    }
    /**
     * Creates a spatialzer for an audio source.
     */
    createSpatializer(id, source, spatialize, audioContext) {
        if (spatialize) {
            return new WebAudioPannerNew(id, source, audioContext, this.gain);
        }
        else {
            return super.createSpatializer(id, source, spatialize, audioContext);
        }
    }
}
//# sourceMappingURL=WebAudioListenerNew.js.map