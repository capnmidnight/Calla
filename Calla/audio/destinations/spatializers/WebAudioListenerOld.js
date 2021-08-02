import { WebAudioPannerOld } from "../../sources/spatializers/WebAudioPannerOld";
import { BaseWebAudioListener } from "./BaseWebAudioListener";
/**
 * A positioner that uses WebAudio's playback dependent time progression.
 **/
export class WebAudioListenerOld extends BaseWebAudioListener {
    /**
     * Creates a new positioner that uses WebAudio's playback dependent time progression.
     */
    constructor() {
        super();
        Object.seal(this);
    }
    /**
     * Performs the spatialization operation for the audio source's latest location.
     */
    update(loc, _t) {
        const { p, f, u } = loc;
        this.listener.setPosition(p[0], p[1], p[2]);
        this.listener.setOrientation(f[0], f[1], f[2], u[0], u[1], u[2]);
    }
    /**
     * Creates a spatialzer for an audio source.
     */
    createSpatializer(spatialize, isRemoteStream, destination) {
        if (spatialize) {
            const dest = isRemoteStream
                ? destination.remoteUserInput
                : destination.spatializedInput;
            return new WebAudioPannerOld(dest);
        }
        else {
            return super.createSpatializer(spatialize, isRemoteStream, destination);
        }
    }
}
//# sourceMappingURL=WebAudioListenerOld.js.map