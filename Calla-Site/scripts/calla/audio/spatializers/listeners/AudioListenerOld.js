import { PannerOld } from "../sources/PannerOld";
import { AudioListenerBase } from "./AudioListenerBase";

/**
 * A positioner that uses WebAudio's playback dependent time progression.
 **/
export class AudioListenerOld extends AudioListenerBase {
    /**
     * Creates a new positioner that uses WebAudio's playback dependent time progression.
     * @param {AudioListener} listener
     */
    constructor(listener) {
        super(listener);

        Object.seal(this);
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     * @param {import("../../positions/Pose").Pose} loc
     */
    update(loc) {
        super.update(loc);
        const { p, f, u } = loc;
        this.node.setPosition(p.x, p.y, p.z);
        this.node.setOrientation(f.x, f.y, f.z, u.x, u.y, u.z);
    }

    /**
     * Creates a spatialzer for an audio source.
     * @private
     * @param {string} id
     * @param {MediaStream|HTMLAudioElement} stream - the audio element that is being spatialized.
     * @param {number} bufferSize - the size of the analysis buffer to use for audio activity detection
     * @param {AudioContext} audioContext
     * @return {import("../sources/BaseSource").BaseSource}
     */
    createSource(id, stream, bufferSize, audioContext) {
        return new PannerOld(id, stream, bufferSize, audioContext);
    }
}

