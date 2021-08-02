import type { Pose } from "../../positions/Pose";
import { BaseEmitter } from "../../sources/spatializers/BaseEmitter";
import { WebAudioPannerNew } from "../../sources/spatializers/WebAudioPannerNew";
import { AudioDestination } from "../AudioDestination";
import { BaseWebAudioListener } from "./BaseWebAudioListener";

/**
 * A positioner that uses WebAudio's playback dependent time progression.
 **/
export class WebAudioListenerNew extends BaseWebAudioListener {
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
    update(loc: Pose, t: number): void {
        const { p, f, u } = loc;
        this.listener.positionX.setValueAtTime(p[0], t);
        this.listener.positionY.setValueAtTime(p[1], t);
        this.listener.positionZ.setValueAtTime(p[2], t);
        this.listener.forwardX.setValueAtTime(f[0], t);
        this.listener.forwardY.setValueAtTime(f[1], t);
        this.listener.forwardZ.setValueAtTime(f[2], t);
        this.listener.upX.setValueAtTime(u[0], t);
        this.listener.upY.setValueAtTime(u[1], t);
        this.listener.upZ.setValueAtTime(u[2], t);
    }

    /**
     * Creates a spatialzer for an audio source.
     */
    createSpatializer(spatialize: boolean, isRemoteStream: boolean, destination: AudioDestination): BaseEmitter {
        if (spatialize) {
            const dest = isRemoteStream
                ? destination.remoteUserInput
                : destination.spatializedInput;
            return new WebAudioPannerNew(dest);
        }
        else {
            return super.createSpatializer(spatialize, isRemoteStream, destination);
        }
    }
}
