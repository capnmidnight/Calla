import { Pose } from "../../positions/Pose.js";
import { PannerOld } from "../sources/PannerOld.js";
import { AudioListenerBase } from "./AudioListenerBase.js";
import { BaseSource } from "../sources/BaseSource.js";

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
     * @param {Pose} loc
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
     * @param {Pose} dest
     * @return {BaseSource}
     */
    createSource(id, stream, bufferSize, audioContext, dest) {
        return new PannerOld(id, stream, bufferSize, audioContext);
    }
}

