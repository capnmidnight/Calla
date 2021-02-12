import type { Pose } from "../../positions/Pose";
import { BaseEmitter } from "../../sources/spatializers/BaseEmitter";
import { WebAudioPannerOld } from "../../sources/spatializers/WebAudioPannerOld";
import { AudioDestination } from "../AudioDestination";
import { BaseWebAudioListener } from "./BaseWebAudioListener";

/**
 * A positioner that uses WebAudio's playback dependent time progression.
 **/
export class WebAudioListenerOld extends BaseWebAudioListener {
    /**
     * Creates a new positioner that uses WebAudio's playback dependent time progression.
     */
    constructor(audioContext: BaseAudioContext) {
        super(audioContext);
        Object.seal(this);
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     */
    update(loc: Pose, _t: number): void {
        const { p, f, u } = loc;
        this.listener.setPosition(p[0], p[1], p[2]);
        this.listener.setOrientation(f[0], f[1], f[2], u[0], u[1], u[2]);
    }

    /**
     * Creates a spatialzer for an audio source.
     */
    createSpatializer(spatialize: boolean, audioContext: BaseAudioContext, destination: AudioDestination): BaseEmitter {
        if (spatialize) {
            return new WebAudioPannerOld(audioContext, destination.spatializedInput);
        }
        else {
            return super.createSpatializer(spatialize, audioContext, destination);
        }
    }
}

